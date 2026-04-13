# Status do Projeto - Sprint 0

## Estrutura Criada (10/04/2026)

Estrutura base full-stack implementada seguindo arquitetura hexagonal e princípios SOLID.

### Backend - Status: 70%

```
backend/
├── package.json ............................ Dependências instaladas
├── src/
│   ├── index.js ............................ Servidor Express + Socket.IO
│   ├── domain/ (Lógica de Negócio)
│   │   ├── entities/
│   │   │   ├── Produto.js ................. Classe Produto
│   │   │   ├── Pedido.js .................. Classe Pedido
│   │   │   └── Cliente.js ................. Classe Cliente
│   │   ├── ports/ (Interfaces)
│   │   │   ├── IProdutoRepository.js
│   │   │   ├── IPedidoRepository.js
│   │   │   └── IClienteRepository.js
│   │   └── strategies/
│   │       └── FreteStrategy.js ........... Strategy Pattern (Sedex, PAC, Retirada)
│   ├── application/ (Casos de Uso)
│   │   └── ListarProdutosUseCase.js
│   ├── infrastructure/ (Adaptadores)
│   │   ├── db/
│   │   │   └── ProdutoRepository.js ....... Adapter Prisma
│   │   └── messaging/
│   │       ├── RabbitMQProducer.js
│   │       └── OrderConsumer.js
│   └── interfaces/ (Ports de Entrada)
│       └── routes/
│           └── produtos.routes.js
├── prisma/
│   └── schema.prisma ....................... BD Schema (6 tabelas)
├── tests/
│   ├── Produto.test.js ..................... 2 testes (PASSING)
│   └── Pedido.test.js ...................... 3 testes (PASSING)
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── .env ..................................... Variáveis de ambiente

Testes: 5 PASSED
```

### Frontend - Status: 50%

```
frontend/
├── package.json ............................ Dependências instaladas
├── index.html
├── vite.config.ts .......................... Configurado
├── tsconfig.json
├── tailwind.config.js ...................... Paleta Paralelo 14 customizada
├── postcss.config.js
├── src/
│   ├── main.tsx ............................ Entrypoint
│   ├── App.tsx ............................. Hello World com Tailwind
│   ├── index.css ........................... Tailwind directives
│   ├── types/
│   │   └── index.ts ........................ Interfaces de domínio
│   ├── components/ ......................... Design System (vazio)
│   ├── pages/ .............................. Páginas (vazio)
│   ├── hooks/
│   │   └── useWebSocket.ts ................. Hook customizado para Socket.IO
│   ├── services/
│   │   └── api.ts .......................... Axios + interceptores
│   └── store/
│       └── store.ts ........................ Estado global (stub)
└── public/ ................................. Assets

Configuração: 100% | Componentes Base: 10%
```

### Infraestrutura - Status: 100%

```
.
├── docker-compose.yml ...................... PostgreSQL 16 + RabbitMQ 3
├── .env.example ............................ Template de variáveis
├── .env (backend/) ......................... Credenciais configuradas
├── .gitignore .............................. Node modules, dist, .env
├── README.md ............................... Documentação básica
├── SETUP.md ................................ Guia de instalação
└── DOCUMENTACAO_N1.md ...................... Especificação completa do projeto
```

## Checklist - Entrega N1

### Artefatos Técnicos

- [x] Repositório Git com estrutura
- [x] Docker Compose (PostgreSQL + RabbitMQ)
- [x] Prisma ORM Schema (6 tabelas)
- [x] Hello World Backend (Express)
- [x] Hello World Frontend (React + Tailwind)
- [x] Testes Unitários (5 testes passando)
- [x] ESLint + Prettier (configurado)
- [ ] **Protótipo Figma** (próximo)
- [ ] **Diagrama C4 - Contexto** (próximo)
- [ ] **Diagrama C4 - Container** (próximo)
- [ ] **Diagrama de Classes UML** (próximo)
- [ ] **Plano de Testes Detalhado** (próximo)

### Documentação

- [x] README.md (instruções básicas)
- [x] SETUP.md (guia local)
- [x] DOCUMENTACAO_N1.md (especificação)
- [ ] **Guia de Estilos** (UI/Colors/Typography)
- [ ] **API.md** (endpoints)

## Estatísticas

| Item | Valor |
|------|-------|
| **Pastas criadas** | 25+ |
| **Arquivos criados** | 30+ |
| **Linhas de código** | ~1200 |
| **Testes** | 5/5 PASSING (100%) |
| **Cobertura Jest** | - (pronto para rodar) |
| **Dependências Backend** | 20 |
| **Dependências Frontend** | 12 |
| **Estilo** | Tailwind CSS + Paleta Customizada |

## Arquitetura Implementada

### Hexagonal (Ports & Adapters)

```
┌─────────────────────────────────────┐
│   INTERFACES (HTTP Routes)          │
│  Entrada: Express.js routes         │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│   APPLICATION (Use Cases)           │
│  ListarProdutosUseCase              │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│   DOMAIN (Lógica de Negócio)        │
│  Entities: Produto, Pedido, Cliente │
│  Ports: IRepository (interfaces)    │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│   INFRASTRUCTURE (Adapters)         │
│  DB: Prisma (PostgreSQL)            │
│  Messaging: RabbitMQ (amqplib)      │
│  WebSocket: Socket.IO               │
└─────────────────────────────────────┘
```

## Design System (Tailwind)

```
Cores Principais:
- Espresso (#2C1A0E): Textos e CTAs
- Arabica (#5C3D1E): Headings
- Gold (#B8860B): Acentos
- Cream (#F5F0E8): Backgrounds

Tipografia:
- Display: Playfair Display 700 | 72px
- Headings: Playfair Display 600 | 48px
- Body: DM Sans 400/500 | 16px
```

## Próximas Fases

### Sprint 1 - Design (17-31/03)
- [ ] Protótipos navegáveis no Figma (8 telas)
- [ ] Guia de Estilos (componentes, estados)
- [ ] Diagramas C4 (Contexto + Container)
- [ ] Diagrama de Classes UML

### Sprint 2 - Backend Core (15-30/04)
- [ ] CRUD Produtos
- [ ] CRUD Clientes
- [ ] Autenticação JWT
- [ ] Testes CT01, CT02, CT07

### Sprint 3 - Mensageria (01-15/05)
- [ ] Fluxo RabbitMQ completo
- [ ] Order Consumer
- [ ] WebSocket para notificações
- [ ] Testes CT03, CT04, CT08

### Sprint 4 - Frontend (15-22/05)
- [ ] Todas as 8 telas em React
- [ ] Integração com API
- [ ] Design fidelidade 100%
- [ ] Responsividade mobile

## Entrega N1

**Data**: até 08/04/2026  
**Formato**: PDF + Apresentação 5min (15/04)

**Conteúdo**:
1. Link Figma (protótipo navegável)
2. Diagramas C4 + Classes
3. Plano de Testes (CT01-CT10)
4. RNFs quantificados
5. Hello World rodando (screenshots)
6. Justificativa Arquitetura Hexagonal

---

**Status Geral**: Sprint 0 - 70% completo  
**Bloqueadores**: Nenhum  
**Próximo Milestone**: Figma Prototype + Diagramas C4