# Paralelo 14 Cafés Especiais

Projeto Integrador da PUC Goiás para demonstrar uma aplicação web full-stack distribuída com mensageria, processamento assíncrono de pedidos e atualização em tempo real.

## Stack oficial do projeto

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Java 17 + Spring Boot 3
- **Persistência:** PostgreSQL
- **Acesso a dados:** Spring Data JPA + Hibernate
- **Migração de banco:** Flyway
- **Mensageria:** RabbitMQ
- **Tempo real:** Socket.IO
- **Infraestrutura local:** Docker Compose

## Objetivo técnico

O sistema simula um e-commerce de cafés especiais em que o pedido é criado pela API, publicado em uma fila RabbitMQ, processado de forma assíncrona e refletido na interface em tempo real.

## Estrutura do repositório

- `frontend/`: aplicação React do cliente e do painel administrativo
- `backend-java/`: backend oficial em Spring Boot
- `backend/`: backend legado em Node.js mantido temporariamente para referência de migração
- `docker-compose.yml`: PostgreSQL e RabbitMQ

## Fluxo principal do pedido

1. O cliente autentica no frontend.
2. O frontend envia `POST /api/pedidos`.
3. O backend Java valida os itens e salva o pedido no PostgreSQL.
4. A API publica uma mensagem na fila `pedidos.novos`.
5. O consumer processa o pedido, atualiza status e reduz estoque.
6. O backend emite `pedido:status:updated` via Socket.IO.
7. O frontend recebe a atualização em tempo real.

## Como executar

### Infraestrutura

Na raiz do projeto:

```powershell
docker compose up -d
```

### Backend Spring Boot

```powershell
cd backend-java
mvn spring-boot:run
```

Backend HTTP: `http://localhost:3001`

### Frontend

```powershell
cd frontend
pnpm install
pnpm run dev
```

Frontend: `http://localhost:5173`

## RabbitMQ Management

- URL: `http://localhost:15672`
- Usuário: `admin`
- Senha: `admin`

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/produtos`
- `POST /api/pedidos`
- `GET /api/pedidos`
- `GET /health`

## Situação atual

O backend oficial do projeto é o módulo `backend-java/`. O módulo `backend/` não deve mais ser usado para execução normal da aplicação e pode ser removido depois da validação final da banca e da documentação.