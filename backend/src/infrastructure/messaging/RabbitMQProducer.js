import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export class RabbitMQProducer {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queue = 'pedidos.novos';
    this.deadLetterExchange = 'pedidos.dlx';
    this.deadLetterQueue = 'pedidos.dlq';
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
      console.log('Conectado ao RabbitMQ');
    } catch (error) {
      console.error('Erro ao conectar RabbitMQ:', error);
      throw error;
    }
  }

  async publishPedido(pedido) {
    try {
      this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(pedido)), {
        persistent: true,
        headers: { 'x-retries': 0 },
      });
      console.log(`Pedido publicado na fila: ${pedido.pedidoId || pedido.id}`);
    } catch (error) {
      console.error('Erro ao publicar pedido:', error);
      throw error;
    }
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
