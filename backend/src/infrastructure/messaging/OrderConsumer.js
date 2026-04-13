import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

export class OrderConsumer {
  constructor(socketAdapter) {
    this.connection = null;
    this.channel = null;
    this.socketAdapter = socketAdapter;
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Consumer conectado ao RabbitMQ');
    } catch (error) {
      console.error('Erro ao conectar consumer:', error);
      throw error;
    }
  }

  async consumePedidos() {
    try {
      const queue = 'pedidos.novos';
      await this.channel.assertQueue(queue, { durable: true });

      this.channel.consume(queue, async (msg) => {
        if (msg) {
          const pedido = JSON.parse(msg.content.toString());
          console.log('Pedido recebido:', pedido.id);

          this.socketAdapter.emitirStatusPedido(pedido.id, 'PROCESSANDO');

          this.channel.ack(msg);
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
}