# Paralelo 14 Cafés Especiais

Projeto Integrador - PUC Goiás - ADS 4º Período

## Descrição

Sistema Web Full-Stack para e-commerce de cafés especiais, com arquitetura hexagonal, mensageria assíncrona e atualizações em tempo real.

## Tecnologias

- **Frontend**: React 18 + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js 20 + Express + Arquitetura Hexagonal
- **Banco**: PostgreSQL 16 + Prisma ORM
- **Mensageria**: RabbitMQ
- **WebSocket**: Socket.IO
- **Containerização**: Docker + Docker Compose

## Setup

1. Clone o repositório
2. Copie `.env.example` para `.env` e configure as variáveis
3. Execute `docker-compose up -d` para subir PostgreSQL e RabbitMQ
4. No backend: `npm install`, `npx prisma migrate dev`, `npm run dev`
5. No frontend: `npm install`, `npm run dev`

## Estrutura do Projeto

- `backend/`: API Node.js com arquitetura hexagonal
- `frontend/`: Aplicação React
- `docker-compose.yml`: Serviços de infraestrutura

## Comandos Úteis

- `docker-compose up -d`: Iniciar serviços
- `docker-compose down`: Parar serviços
- `npx prisma studio`: Interface gráfica do banco