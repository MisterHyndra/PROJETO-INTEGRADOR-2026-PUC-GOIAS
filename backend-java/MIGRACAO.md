# Plano de migração Node.js -> Spring Boot

## O que foi feito

- Criado novo módulo `backend-java/` sem remover o backend Node existente.
- Reimplementadas as principais rotas HTTP consumidas pelo frontend.
- Mantidos os contratos base de autenticação, produtos, pedidos, avaliações, admin e health.
- Configurados PostgreSQL, JWT, RabbitMQ, Flyway e Socket.IO para o backend Java.
- Validado o build do módulo com `mvn test`.

## Compatibilidade preservada

### Rotas
- `POST /api/auth/register`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/produtos`
- `GET /api/produtos/{id}`
- `POST /api/produtos`
- `PUT /api/produtos/{id}`
- `DELETE /api/produtos/{id}`
- `POST /api/pedidos`
- `GET /api/pedidos`
- `GET /api/pedidos/{id}`
- `PATCH /api/pedidos/{id}`
- `PUT /api/pedidos/{id}/status`
- `DELETE /api/pedidos/{id}`
- `POST /api/avaliacoes`
- `GET /api/avaliacoes/produto/{produtoId}`
- `GET /api/admin/produtos`
- `POST /api/admin/produtos`
- `PUT /api/admin/produtos/{id}`
- `DELETE /api/admin/produtos/{id}`
- `GET /api/admin/pedidos`
- `PATCH /api/admin/pedidos/{id}/status`
- `GET /api/admin/stats`
- `GET /health`

### Regras de negócio mantidas
- JWT Bearer com `id`, `email`, `role`
- Refresh token persistido no banco
- Pedido criado com status inicial `PROCESSANDO`
- Frete fixo `PAC`, `SEDEX` e `RETIRADA`
- Atualização de estoque no consumo assíncrono
- Notificação de status do pedido via Socket.IO
- Soft delete de produto com `ativo=false`

## Ponto pendente importante

### WebSocket / Socket.IO
O frontend atual conecta em `http://localhost:3001`, mas o servidor Socket.IO Java está em `3002`.

Para fechar a migração sem mexer no frontend, há duas opções:

1. colocar um proxy reverso para expor HTTP e Socket.IO na mesma porta; ou
2. ajustar o frontend para usar uma variável de ambiente apontando para `3002`.

## Próximos passos recomendados

1. Subir `backend-java` com PostgreSQL e RabbitMQ.
2. Testar login, catálogo, checkout e painel admin pelo frontend.
3. Resolver a compatibilidade final do Socket.IO na mesma porta esperada pelo frontend.
4. Depois disso, trocar oficialmente o backend ativo do projeto.

## Variáveis de ambiente

O módulo Java agora aceita:

- o `.env` atual de `backend/.env`
- o `.env` da raiz do projeto
- um `.env` próprio dentro de `backend-java/`

Também entende as variáveis legadas:

- `DATABASE_URL`
- `JWT_SECRET`
- `RABBITMQ_URL`
- `PORT`
- `WS_PORT`

## Sobre o `V1__init.sql`

Esse arquivo não foi criado para substituir automaticamente o banco atual em uso.

Ele existe para:

- documentar a estrutura esperada pelo backend Java
- permitir subir o módulo em ambientes novos
- servir como baseline do Flyway

Se o banco atual já está funcionando, a ideia é reaproveitá-lo, não reinicializá-lo.
