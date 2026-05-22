# Backend Java Spring Boot

Este módulo reimplementa o backend original em Node.js usando Java 17 + Spring Boot.

## Objetivo

Manter o contrato consumido pelo frontend em `frontend/` sem quebrar rotas, autenticação, RabbitMQ e atualização em tempo real.

## Principais compatibilidades

- Mesma porta HTTP padrão: `3001`
- Mesmos endpoints `/api/auth`, `/api/produtos`, `/api/pedidos`, `/api/avaliacoes`, `/api/admin`
- JWT Bearer compatível com payload `id`, `email`, `role`
- Refresh token persistido no banco
- RabbitMQ com fila `pedidos.novos` e DLQ
- Evento Socket.IO `pedido:status:updated`

## Requisitos

- Java 17+
- Maven 3.9+
- PostgreSQL
- RabbitMQ

## Executar

1. Garanta que PostgreSQL e RabbitMQ estejam ativos.
2. O módulo Java já tenta ler automaticamente os arquivos `.env` em:
   - `../backend/.env`
   - `../.env`
   - `./.env`
3. Se quiser, você também pode criar um `.env` próprio dentro de `backend-java/` usando `backend-java/.env.example`.
3. Rode:
   - `mvn spring-boot:run`

## Observações

- O arquivo `src/main/resources/db/migration/V1__init.sql` existe para ambientes novos. Se o banco atual já existe e está funcionando, não é para recriar nem apagar os dados. Ele serve apenas como baseline estrutural do módulo Java.
- O frontend atual usa `socket.io-client` em `http://localhost:3001` e hoje o servidor de socket Java sobe por padrão na porta `3002`. Para compatibilidade total, o próximo passo é alinhar isso via proxy reverso ou adaptar o frontend para usar a nova porta de socket.
- O módulo foi criado em paralelo, sem remover o backend Node existente.
