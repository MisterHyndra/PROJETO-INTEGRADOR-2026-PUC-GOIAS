# Instalação e Setup - Paralelo 14

## Pré-requisitos

- Node.js 20+
- PostgreSQL 16
- Docker + Docker Compose
- Git

## Setup Local

### 1. Clonar Repositório

```bash
git clone <seu-repo>
cd paralelo14
```

### 2. Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env

# Backend
cd backend && cp .env.example .env
# Editar backend/.env com suas credenciais
```

### 3. Banco de Dados (PostgreSQL)

#### Opção A: Com Docker Compose

```bash
docker-compose up -d
```

Aguarde 10-15 segundos para o PostgreSQL estar pronto.

#### Opção B: PostgreSQL Local

```bash
# Criar banco manualmente via PGAdmin
# Ou via psql:
psql -U postgres -h localhost -c "CREATE DATABASE paralelo14;"
```

### 4. Setup Backend

```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar Migrations
npx prisma migrate dev --name init

# (Opcional) Seed de dados
npx prisma db seed

# Iniciar servidor
npm run dev
```

O backend rodará em `http://localhost:3001`

### 5. Setup Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
```

O frontend rodará em `http://localhost:5173`

## Verificação de Funcionamento

### Health Check Backend

```bash
curl http://localhost:3001/api/produtos
```

Esperado: Array de produtos `[]` ou lista de produtos.

### RabbitMQ Management (se Docker Compose)

```
http://localhost:15672
username: admin
password: admin
```

### Banco de Dados

```bash
# Abrir Prisma Studio
cd backend && npx prisma studio
```

## Testes

```bash
cd backend

# Rodar todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Build para Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Será gerado em frontend/dist/
```

## Troubleshooting

### Erro: "Cannot connect to PostgreSQL"

- Verificar se PostgreSQL está rodando
- Verificar credenciais em `.env`
- Se Docker: `docker-compose logs postgres`

### Erro: "Cannot connect to RabbitMQ"

- Verificar se RabbitMQ está rodando
- Se Docker: `docker-compose logs rabbitmq`
- Aguardar 30s após `docker-compose up`

### Erro: "Prisma migrations failed"

```bash
cd backend
npx prisma migrate reset
```

## Documentação Adicional

- [Arquitetura Backend](../backend/README.md)
- [Design System Frontend](../frontend/README.md)
- [API Endpoints](./API.md)