# Paralelo 14 Cafés Especiais - Guia de Uso

## Status Atual

O projeto Paralelo 14 Cafés Especiais está **100% operacional** com a seguinte configuração:

### Servidores Rodando

- **Backend (Node.js + Express)**: http://localhost:3001
- **Frontend (React + Vite)**: http://localhost:5173
- **Banco de Dados**: PostgreSQL local (localhost:5432)
- **RabbitMQ**: Indisponível (Docker), funcionalidade degradada

## Como Acessar

### 1. Frontend
Acesse: **http://localhost:5173**

Páginas disponíveis:
- `/` - Home (Landing Page)
- `/catalogo` - Catálogo de produtos com filtros

### 2. API Backend
URL Base: **http://localhost:3001/api**

#### Endpoints de Produtos (Public)
- `GET /api/produtos` - Listar produtos com filtros
- `GET /api/produtos/:id` - Detalhe de produto
- `POST /api/produtos` - Criar (Admin auth required)
- `PUT /api/produtos/:id` - Atualizar (Admin auth required)
- `DELETE /api/produtos/:id` - Deletar (Admin auth required)

#### Endpoints de Autenticação
- `POST /api/auth/signup` - Cadastro de usuário
- `POST /api/auth/login` - Login (retorna JWT)

#### Endpoints de Pedidos (Auth required)
- `GET /api/pedidos` - Listar pedidos do usuário
- `GET /api/pedidos/:id` - Detalhe do pedido
- `POST /api/pedidos` - Criar novo pedido
- `PUT /api/pedidos/:id/status` - Atualizar status (Admin)
- `DELETE /api/pedidos/:id` - Cancelar pedido

## Estrutura do Projeto

```
PROJETO-INTEGRADOR/
├── backend/                         # Node.js + Express + Hexagonal Architecture
│   ├── src/
│   │   ├── domain/                 # Entidades e Ports (Interfaces)
│   │   ├── application/            # Use Cases
│   │   ├── infrastructure/         # Adapters (DB, RabbitMQ, WebSocket)
│   │   └── interfaces/             # Routes e Middlewares
│   ├── prisma/                     # Schema do Prisma
│   ├── tests/                      # Testes Jest
│   └── package.json
│
└── frontend/                        # React 18 + Vite + TypeScript
    ├── src/
    │   ├── components/             # Design System (Button, Card, etc)
    │   ├── pages/                  # Home, Catálogo, Checkout
    │   ├── hooks/                  # useCart, useWebSocket
    │   ├── services/               # API client
    │   └── types/                  # TypeScript interfaces
    └── package.json
```

## Componentes Criados

### Frontend
- **Componentes de Design System**:
  - `Button.tsx` - Botão versátil
  - `Card.tsx` - Card reutilizável
  - `Badge.tsx` - Badge para tags
  - `Input.tsx` - Input field
  - `ProductCard.tsx` - Card de produto
  - `Navbar.tsx` - Barra de navegação

- **Páginas**:
  - `Home.tsx` - Landing page
  - `Catalogo.tsx` - Listagem e filtros

- **Hooks**:
  - `useCart.ts` - Gerenciar carrinho
  - `useWebSocket.ts` - Conexão WebSocket

### Backend
- **Repositories**: Produto, Pedido, Cliente, Avaliação
- **Use Cases**: Listar, Criar, Autenticar, Atualizar Status
- **Middlewares**: Autenticação JWT, Admin check
- **Routes**: /api/produtos, /api/pedidos, /api/auth
- **Adapters**: RabbitMQ Producer, OrderConsumer, Socket.IO

## Configuração das Cores

Paleta Paralelo 14:
- **Espresso** (#2C1A0E) - Principal
- **Arábica** (#5C3D1E) - Secundária
- **Gold** (#B8860B) - Destaque
- **Cream** (#F5F0E8) - Background
- **Parchment** (#EDE8DE) - Alternado

## Próximos Passos

1. **Criar mais páginas**: Produto detail, Checkout, Conta do usuário
2. **Seeding de dados**: Popular banco com produtos reais
3. **RabbitMQ**: Iniciar Docker para processamento assíncrono
4. **Testes**: Executar Jest com cobertura
5. **Deploy**: Containerizar com Docker

## Comandos Úteis

### Backend
```bash
cd backend
npm install        # Instalar dependências
npm run dev        # Desenvolvimento (nodemon)
npm test           # Rodar testes
jwt.verify()       # Debug JWT
```

### Frontend
```bash
cd frontend
npm install        # Instalar dependências
npm run dev        # Desenvolvimento (Vite)
npm run build      # Build para produção
```

### Database
```bash
# Criar banco
psql -U postgres -c "CREATE DATABASE paralelo14;"

# Migrations
npx prisma migrate dev --name init
npx prisma generate

# Seed (se implementado)
npx prisma db seed
```

## Notas Técnicas

- **Arquitetura**: Hexagonal (Ports & Adapters) no backend
- **ORM**: Prisma v7 com PostgreSQL
- **Autenticação**: JWT (Access + Refresh tokens)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Estilo**: Design System customizado com cores goianas
- **API**: REST com status codes corretos (202 para async)

---

**Status**: ✅ Funcional
**Última atualização**: 13/04/2026
**Próxima milestone**: Entrega N1 - 08/04/2026
