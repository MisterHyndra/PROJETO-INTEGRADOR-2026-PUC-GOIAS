import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import produtosRoutes from './interfaces/routes/produtos.routes.js';
import authRoutes from './interfaces/routes/auth.routes.js';
import pedidosRoutes from './interfaces/routes/pedidos.routes.js';
import avaliacoesRoutes from './interfaces/routes/avaliacoes.routes.js';
import adminRoutes from './interfaces/routes/admin.routes.js';
import { RabbitMQProducer } from './infrastructure/messaging/RabbitMQProducer.js';
import { OrderConsumer } from './infrastructure/messaging/OrderConsumer.js';
import { SocketIOAdapter } from './infrastructure/websocket/SocketIOAdapter.js';

dotenv.config({ quiet: true });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], methods: ['GET', 'POST'] },
});

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' })); // 10mb for base64 image uploads

// Socket.IO Adapter
const socketAdapter = new SocketIOAdapter(io);
socketAdapter.configurar();
app.locals.socketAdapter = socketAdapter;

// RabbitMQ — required infrastructure
const producer = new RabbitMQProducer();
const consumer = new OrderConsumer(socketAdapter);

app.locals.publisher = null;
app.locals.messaging = { connected: false, mode: 'rabbitmq' };

async function conectarMensageria() {
  await producer.connect();
  await consumer.connect();
  await consumer.consumePedidos();
  app.locals.publisher = producer;
  app.locals.messaging = { connected: true, mode: 'rabbitmq' };
  console.log(' RabbitMQ conectado');
}

// Routes
app.use('/api/produtos', produtosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    timestamp: new Date(),
    messaging: req.app.locals.messaging,
  })
);

const PORT = process.env.PORT || 3001;

conectarMensageria()
  .then(() => {
    server.listen(PORT, () => {
      console.log(` Paralelo 14 API rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' Falha ao inicializar mensageria RabbitMQ:', error.message);
    process.exit(1);
  });

export { io };
