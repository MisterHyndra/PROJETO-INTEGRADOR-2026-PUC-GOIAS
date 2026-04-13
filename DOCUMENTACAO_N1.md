# Paralelo 14 Cafés Especiais - Documentação N1

## 1. Identidade do Projeto

**Nome**: Paralelo 14 - Cafés Especiais  
**Descrição**: E-commerce full-stack para venda de cafés especiais de origem goiana  
**Lema**: "Do Paralelo 14 para sua xícara - altitude, origem e cuidado em cada grão"

## 2. Stack Tecnológico

### Frontend
- **React 18** + **Vite** (bundler rápido)
- **TypeScript** para type-safety
- **Tailwind CSS** com paleta customizada (Paralelo 14)
- **Zustand** para gerenciamento de estado
- **Socket.IO Client** para WebSocket

### Backend
- **Node.js 20** + **Express** (servidor HTTP)
- **Arquitetura Hexagonal** (Ports & Adapters)
- **Prisma ORM** para acesso ao banco
- **Socket.IO** para notificações em tempo real
- **amqplib** para integração com RabbitMQ
- **JWT** para autenticação

### Infraestrutura
- **PostgreSQL 16** (banco relacional)
- **RabbitMQ** (broker de mensagens)
- **Docker Compose** (containerização)

## 3. Arquitetura Hexagonal - Backend

```
backend/src/
├── domain/             # Lógica de negócio (independente de frameworks)
│   ├── entities/       # Classe Produto, Pedido, Cliente
│   └── ports/          # Interfaces: IProdutoRepository, IPedidoRepository
├── application/        # Casos de uso
│   └── ListarProdutosUseCase.js
├── infrastructure/     # Implementações concretas
│   ├── db/            # Adaptador Prisma (ProdutoRepository.js)
│   └── messaging/     # Adaptadores RabbitMQ
└── interfaces/        # HTTP (Express routes) e WebSocket
    └── routes/        # produtos.routes.js, pedidos.routes.js
```

### Padrões Utilizados

| Padrão | Categoria | Aplicação |
|--------|-----------|-----------|
| **Repository** | Estrutural | Abstração do Prisma para cada entidade |
| **Factory** | Criacional | Criação de instâncias StatusPedido |
| **Observer** | Comportamental | Notificações via WebSocket |
| **Strategy** | Comportamental | Estratégias de frete (Sedex, PAC, Retirada) |
| **Dependency Injection** | SOLID | Injeção via construtor em todos os serviços |

## 4. Modelagem de Dados

### Tabelas Principais

#### Cliente
- `id` (UUID, PK)
- `nome`, `email`, `cpf`, `telefone`
- `senhaHash` (bcrypt com salt ≥ 12)
- `enderecos[]` (relação 1-N)
- `pedidos[]` (relação 1-N)

#### Produto
- `id` (UUID, PK)
- `nome`, `descricao`, `preco`, `estoque`
- `origem`, `altitudeM`, `processo`, `torra`, `imagemUrl`
- `ativo` (boolean)

#### Pedido
- `id` (UUID, PK)
- `clienteId` (FK)
- `status` (enum: AGUARDANDO_PAGAMENTO, PROCESSANDO, SEPARANDO, ENVIADO, ENTREGUE, CANCELADO)
- `subtotal`, `frete`, `total`
- `metodoPagamento`
- `createdAt`, `updatedAt`
- `itens[]` (relação 1-N)

#### ItemPedido
- `id` (UUID, PK)
- `pedidoId`, `produtoId` (FKs)
- `quantidade`, `precoUnitario`

## 5. Design System (Paleta Tailwind)

```javascript
colors: {
  espresso: '#2C1A0E',     // Cor primária - textos principais
  arabica: '#5C3D1E',      // Cor secundária - headings
  gold: '#B8860B',         // Acento - icons, badges
  cream: '#F5F0E8',        // Background suave
  parchment: '#EDE8DE',    // Background destaque
  text: '#1A1A1A',         // Texto = máximo contraste
}
```

### Tipografia
- **Display** (Hero): Playfair Display 700 | 72px
- **Headings**: Playfair Display 600 | 48-64px
- **Body**: DM Sans 400/500 | 16px
- **Labels**: DM Mono 400 | 14px

## 6. Fluxo Assíncrono de Pedido

```
1. Cliente (React)         → POST /api/pedidos
2. API (Express)           → Valida, persiste Pedido (PROCESSANDO)
3. API                     → Publica em fila: pedidos.novos
4. API                     → Retorna 202 Accepted + pedido_id
5. Consumer (Worker)       → Consome mensagem
6. Consumer                → Processa pagamento (mock) + estoque
7. Consumer                → Atualiza status: SEPARANDO → ENVIADO
8. Consumer                → Emite evento: pedido:status:updated (Socket.IO)
9. Cliente (React)         → Recebe evento, atualiza UI em tempo real
```

**Dead-Letter Queue**: `pedidos.dlq` - captura falhas com 3+ tentativas

## 7. Testes Planejados (N1)

### Unitários
- `CT01`: Calcular total do pedido (com frete)
- `CT02`: Redução de estoque
- `CT07`: Strategy pattern (frete)

### Integração
- `CT03`: Publicação em fila RabbitMQ
- `CT04`: Atualização via WebSocket
- `CT05`: Autenticação JWT (token inválido → 401)
- `CT06`: Cadastro com email duplicado → 409
- `CT08`: Dead-Letter Queue
- `CT09`: Filtros de produtos

### E2E
- `CT10`: Fluxo completo (Login → Carrinho → Checkout → Status)

**Métrica**: Cobertura ≥ 70% nas classes de domínio/serviço

## 8. Arquivos Principais Criados

### Backend
```
backend/
├── package.json            (Express, Prisma, amqplib, Jest, ESLint)
├── src/index.js           (Servidor Express + Socket.IO)
├── src/domain/
│   ├── entities/Produto.js
│   └── ports/IProdutoRepository.js, IPedidoRepository.js
├── src/infrastructure/
│   ├── db/ProdutoRepository.js
│   └── messaging/RabbitMQProducer.js, OrderConsumer.js
├── src/application/ListarProdutosUseCase.js
├── src/interfaces/routes/produtos.routes.js
├── prisma/schema.prisma
├── tests/Produto.test.js
├── jest.config.js, .eslintrc.js, .prettierrc
└── .env (DB_HOST, RABBITMQ_URL, JWT_SECRET, PORT)
```

### Frontend
```
frontend/
├── package.json            (React, Vite, Tailwind)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js      (paleta Paralelo 14)
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx            (Hello World com Tailwind)
│   ├── index.css          (Tailwind directives)
│   ├── components/        (Design System)
│   ├── pages/             (Home, Catalogo, Checkout, etc)
│   ├── hooks/             (usePedido, useWebSocket, etc)
│   ├── services/          (api.js, socket.js)
│   └── store/             (Zustand context)
└── public/                (Assets)
```

### Raiz
```
.
├── docker-compose.yml     (PostgreSQL + RabbitMQ)
├── .env, .env.example
├── .gitignore
└── README.md
```

## 9. Próximos Passos (Sprint 0 em andamento)

**Checklist N1:**
- [x] Estrutura de pastas (Hexagonal)
- [x] Docker Compose (PostgreSQL + RabbitMQ)
- [x] Prisma schema
- [x] Hello World API + React
- [x] Tooling (ESLint, Prettier, Jest)
- [ ] Subir containers Docker
- [ ] Migrations Prisma
- [ ] Protótipo Figma (8 telas)
- [ ] Diagramas C4 (Contexto, Container)
- [ ] Diagrama de Classes UML

## 10. Entrega N1 (até 08/04/2026)

**Documento PDF contendo:**
1. Link Figma navegável (Design System + protótipos)
2. Diagramas C4 (Contexto e Container)
3. Diagrama de Classes (UML)
4. Plano de Testes (CT01-CT10)
5. Requisitos Não-Funcionais (RNF01-RNF07)
6. Evidência: Hello World funcionando (backend + frontend)
7. Justificativa: Por que Arquitetura Hexagonal

## 11. Cronograma

| Sprint | Período | Entregáveis |
|--------|---------|-------------|
| 0 - Setup | 10-17/03 | Estrutura, Docker, Prisma, Hello World |
| 1 - Design | 17-31/03 | Figma, Guia de Estilos, Diagramas |
| N1 | até 08/04 | Artefatos |
| Apresentação N1 | 15/04 | Pitch 5min + Demo ao vivo |
| 2 - Backend Core | 15-30/04 | CRUD, JWT, testes CT01-CT02-CT07 |
| 3 - Mensageria | 01-15/05 | RabbitMQ, Consumer, WebSocket, testes |
| 4 - Frontend | 15-22/05 | Todas as telas React, design fidelity |
| N2 | até 22/05 | Código, Docker, testes, documentação |
| Banca N2 | 03/06 | 7-10min + 5min arguição |

---

**Status Geral**: Sprint 0 - Em Progresso (70%)  
**Próxima Milestone**: Figma Prototype + Diagramas C4