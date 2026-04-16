CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

ALTER TABLE "refresh_tokens"
ADD CONSTRAINT "refresh_tokens_clienteId_fkey"
FOREIGN KEY ("clienteId") REFERENCES "clientes"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "pedido_status_historico" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL,
    "origem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedido_status_historico_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "pedido_status_historico"
ADD CONSTRAINT "pedido_status_historico_pedidoId_fkey"
FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
