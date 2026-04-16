import amqplib from 'amqplib';
import dotenv from 'dotenv';
import { PedidoRepository } from '../db/PedidoRepository.js';
import { ProdutoRepository } from '../db/ProdutoRepository.js';
import { AtualizarStatusPedidoUseCase } from '../../application/AtualizarStatusPedidoUseCase.js';

dotenv.config({ quiet: true });

export class OrderConsumer {
  constructor(socketAdapter) {
    this.connection = null;
    this.channel = null;
    this.socketAdapter = socketAdapter;
    this.queue = 'pedidos.novos';
    this.deadLetterExchange = 'pedidos.dlx';
    this.deadLetterQueue = 'pedidos.dlq';
    this.maxRetries = 3;
    this.pedidoRepository = new PedidoRepository();
    this.produtoRepository = new ProdutoRepository();
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.deadLetterExchange, 'direct', { durable: true });
      await this.channel.assertQueue(this.deadLetterQueue, { durable: true });
      await this.channel.bindQueue(this.deadLetterQueue, this.deadLetterExchange, this.deadLetterQueue);
      await this.channel.assertQueue(this.queue, {
        durable: true,
        deadLetterExchange: this.deadLetterExchange,
        deadLetterRoutingKey: this.deadLetterQueue,
      });
      console.log('Consumer conectado ao RabbitMQ');
    } catch (error) {
      console.error('Erro ao conectar consumer:', error);
      throw error;
    }
  }

  async consumePedidos() {
    try {
      this.channel.consume(this.queue, async (msg) => {
        if (msg) {
          const retries = Number(msg.properties.headers?.['x-retries'] || 0);
          try {
            const payload = JSON.parse(msg.content.toString());
            await this.processarPedido(payload.pedidoId || payload.id);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Erro ao processar pedido:', error.message);

            if (retries >= this.maxRetries) {
              this.channel.publish(
                this.deadLetterExchange,
                this.deadLetterQueue,
                msg.content,
                {
                  persistent: true,
                  headers: {
                    ...msg.properties.headers,
                    'x-retries': retries,
                    'x-error-message': error.message,
                  },
                }
              );
              this.channel.ack(msg);
              return;
            }

            this.channel.sendToQueue(this.queue, msg.content, {
              persistent: true,
              headers: {
                ...msg.properties.headers,
                'x-retries': retries + 1,
              },
            });
            this.channel.ack(msg);
          }
        }
      });

      console.log('Consumer aguardando pedidos...');
    } catch (error) {
      console.error('Erro ao consumir pedidos:', error);
      throw error;
    }
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async processarPedido(pedidoId) {
    const pedido = await this.pedidoRepository.buscarPorId(pedidoId);
    if (!pedido) {
      throw new Error(`Pedido ${pedidoId} não encontrado`);
    }

    const atualizarStatus = new AtualizarStatusPedidoUseCase(
      this.pedidoRepository,
      this.socketAdapter
    );

    await atualizarStatus.execute({
      pedidoId,
      novoStatus: 'SEPARANDO',
      origem: 'CONSUMER',
    });

    for (const item of pedido.itens) {
      await this.produtoRepository.reduzirEstoque(item.produtoId, item.quantidade);
    }

    await atualizarStatus.execute({
      pedidoId,
      novoStatus: 'ENVIADO',
      origem: 'CONSUMER',
    });
  }
}
