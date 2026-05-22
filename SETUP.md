# Setup do Projeto - Paralelo 14 Cafés Especiais

## Pré-requisitos

- Java 17+
- Maven 3.9+
- Node.js 20+
- pnpm
- Docker + Docker Compose

## 1. Subir infraestrutura

Na raiz do projeto:

```powershell
docker compose up -d
```

Isso sobe:

- PostgreSQL
- RabbitMQ

## 2. Variáveis de ambiente

O projeto lê valores do arquivo `.env` na raiz e também pode usar `backend-java/.env`.

Arquivos disponíveis:

- `.env.example`
- `backend-java/.env.example`

Se necessário, copie e ajuste os valores.

## 3. Rodar backend Java

```powershell
cd backend-java
mvn spring-boot:run
```

Serviços expostos:

- API HTTP: `http://localhost:3001`
- Socket.IO: `http://localhost:3002`

## 4. Rodar frontend

```powershell
cd frontend
pnpm install
pnpm run dev
```

Frontend:

- `http://localhost:5173`

## 5. Verificações rápidas

### Produtos

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/produtos"
```

### Health check

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

### RabbitMQ Management

- URL: `http://localhost:15672`
- Usuário: `admin`
- Senha: `admin`

## 6. Testes

### Backend Java

```powershell
cd backend-java
mvn test
```

### Frontend build

```powershell
cd frontend
pnpm build
```

## 7. Troubleshooting

### Erro ao criar pedido

Verifique:

- se o usuário está logado
- se o backend Java está rodando em `3001`
- se o RabbitMQ está ativo
- se existe estoque para o produto escolhido

### RabbitMQ fora do ar

```powershell
docker compose logs rabbitmq
```

### PostgreSQL fora do ar

```powershell
docker compose logs postgres
```

## 8. Observação importante

O backend oficial é `backend-java/`. O diretório `backend/` representa a implementação legada em Node.js e não deve ser usado no fluxo normal da apresentação final.