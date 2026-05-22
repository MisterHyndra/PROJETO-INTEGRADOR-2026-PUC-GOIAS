# Guia de Acesso - Paralelo 14 Cafés Especiais

## Endereços principais

- **Frontend:** `http://localhost:5173`
- **Backend Spring Boot:** `http://localhost:3001`
- **Socket.IO:** `http://localhost:3002`
- **RabbitMQ Management:** `http://localhost:15672`

## Credenciais do RabbitMQ

- Usuário: `admin`
- Senha: `admin`

## APIs principais

### Públicas

- `GET /api/produtos`
- `GET /api/produtos/{id}`
- `GET /api/avaliacoes/produto/{produtoId}`
- `POST /api/auth/login`
- `POST /api/auth/signup`

### Autenticadas

- `GET /api/auth/me`
- `POST /api/pedidos`
- `GET /api/pedidos`
- `GET /api/pedidos/{id}`
- `DELETE /api/pedidos/{id}`

### Administrativas

- `POST /api/admin/produtos`
- `PATCH /api/pedidos/{id}`
- `PUT /api/pedidos/{id}/status`

## Pastas relevantes

- `frontend/`: interface React
- `backend-java/`: backend oficial em Spring Boot
- `backend/`: implementação legada em Node.js

## Fluxo para acessar tudo localmente

1. Execute `docker compose up -d` na raiz.
2. Rode `mvn spring-boot:run` em `backend-java/`.
3. Rode `pnpm run dev` em `frontend/`.
4. Acesse o frontend em `http://localhost:5173`.
5. Para inspecionar filas, abra `http://localhost:15672`.

## Observação

Para a apresentação final e para a documentação atualizada, o backend válido do projeto é o Spring Boot em `backend-java/`.
