import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

export class RabbitMQProducer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log('Conectado ao RabbitMQ');
    } catch (error) {
      console.error('Erro ao conectar RabbitMQ:', error);
      throw error;
    }
  }

  async publishPedido(pedido) {
    try {
      const queue = 'pedidos.novos';
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(pedido)));
      console.log(`Pedido publicado na fila: ${pedido.id}`);
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