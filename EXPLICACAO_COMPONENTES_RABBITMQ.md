# Explicação da Conexão Entre os Componentes e o RabbitMQ

Este documento explica de forma simples como os componentes do projeto **Paralelo 14 Cafés Especiais** se conectam, principalmente na parte de **mensageria com RabbitMQ**.

---

## 1. Visão geral da conexão entre os componentes

No projeto, os principais blocos sao:

- **Frontend React**
- **API Java Spring Boot**
- **PostgreSQL**
- **RabbitMQ**
- **Pedido Consumer**
- **Socket.IO**

A ideia principal e:

- o **frontend** envia a ação do usuário
- a **API** recebe essa ação
- a **API** salva os dados no banco
- depois a **API publica uma mensagem na fila**
- o **consumer** pega essa mensagem
- o **consumer processa o pedido em segundo plano**
- o **backend atualiza a tela em tempo real**

---

## 2. Relacao com o Diagrama C4 - Nivel 1

No **Nivel 1 - Contexto**, o foco e mostrar:

- quem usa o sistema
- quais sistemas externos existem

### Quem interage com o sistema

- **Cliente**
  navega, escolhe produtos e faz pedidos
- **Administrador**
  gerencia estoque e pedidos

### Sistemas externos

- **Sistema de Pagamento**
- **Servico de E-mail**

### Como explicar isso

Voce pode dizer:

"No diagrama de contexto mostramos os atores principais, que sao cliente e administrador, e os sistemas externos que o software pode integrar, como pagamento e envio de confirmacoes. O objetivo aqui nao e detalhar implementacao, mas mostrar o ecossistema em volta do sistema Paralelo 14."

---

## 2. Relação com a arquitetura do projeto

Os containers técnicos principais são:

- React SPA
- Spring Boot API
- PostgreSQL
- RabbitMQ Broker
- Consumer assíncrono

### O que cada container faz

#### React SPA Loja

E a interface do cliente.

Responsabilidades:

- listar produtos
- mostrar catalogo
- carrinho
- checkout
- area do usuario

#### React SPA Admin Dashboard

E a interface administrativa.

Responsabilidades:

- cadastrar produtos
- editar produtos
- acompanhar pedidos
- ver estatisticas

#### API Spring Boot

É o backend principal.

Responsabilidades:

- receber requisições HTTP
- autenticar usuários
- validar regras de negócio
- salvar dados no banco
- publicar mensagens no RabbitMQ

#### PostgreSQL

E o banco principal.

Responsabilidades:

- armazenar usuarios
- produtos
- pedidos
- itens do pedido
- refresh tokens
- historico de status

#### RabbitMQ Broker

E o servico de mensageria.

Responsabilidades:

- receber a mensagem publicada pela API
- armazenar temporariamente essa mensagem na fila
- entregar a mensagem ao consumer

#### Order Consumer

É o trabalhador assíncrono.

Responsabilidades:

- ouvir a fila
- pegar pedidos novos
- atualizar status
- reduzir estoque
- disparar atualização em tempo real

---

## 3. Onde entra o RabbitMQ nessa arquitetura

O RabbitMQ fica **entre a API e o consumer**.

Ele serve como intermediario.

### Fluxo simplificado

```text
Frontend -> API -> Banco
               -> RabbitMQ -> Consumer -> Banco
                                      -> Socket.IO -> Frontend
```

### Explicacao simples

O frontend nao fala diretamente com o RabbitMQ.

Quem fala com o RabbitMQ é a API Spring Boot.

O RabbitMQ tambem nao atualiza a tela.

Quem atualiza a tela e o backend, via Socket.IO, depois que o consumer processa o pedido.

---

## 4. Como o pedido entra no RabbitMQ

Quando o usuário finaliza a compra:

1. O frontend chama:

```http
POST /api/pedidos
```

2. A API valida os itens e calcula subtotal, frete e total.
3. O pedido é salvo no banco.
4. Depois disso, a API publica uma mensagem no RabbitMQ.

Essa publicação acontece em:

- `PedidoProducer.java`

Fila principal:

```txt
pedidos.novos
```

Mensagem enviada:

```json
{
  "pedidoId": "id-do-pedido",
  "clienteId": "id-do-cliente"
}
```

### Como explicar isso

"A API não envia o pedido inteiro para processamento direto. Ela salva o pedido no banco e envia uma mensagem com o identificador para a fila. O consumer pega esse identificador e continua o trabalho depois."

---

## 5. Como o consumer usa essa fila

O consumer está em:

- `PedidoConsumer.java`

O fluxo do consumer é:

1. receber a mensagem da fila
2. extrair `pedidoId`
3. buscar o pedido no banco
4. atualizar o status para `SEPARANDO`
5. reduzir o estoque dos itens
6. atualizar o status para `ENVIADO`
7. emitir `pedido:status:updated` via Socket.IO

Ele:

- conecta no RabbitMQ
- escuta a fila `pedidos.novos`
- recebe a mensagem
- busca o pedido no banco
- muda status
- reduz estoque

### Fluxo interno do consumer

1. recebe mensagem da fila
2. le o `pedidoId`
3. busca o pedido no banco
4. atualiza para `SEPARANDO`
5. reduz estoque dos itens
6. atualiza para `ENVIADO`
7. emite evento de status

---

## 7. Como isso volta para a tela do usuario

Depois do processamento, entra o **Socket.IO**.

Arquivo:

- [SocketIOAdapter.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\websocket\SocketIOAdapter.js)

Ele envia eventos para o frontend dizendo:

- qual pedido mudou
- qual o novo status

Assim o usuario ve o pedido mudar de estado em tempo real.

### Explicacao curta

"O RabbitMQ resolve a comunicacao assincrona entre backend e consumer. O Socket.IO resolve a comunicacao em tempo real entre backend e frontend."

---

## 8. Qual o papel do banco nessa conexao

O PostgreSQL e a fonte de verdade.

Ele nao e substituido pelo RabbitMQ.

### Diferenca entre banco e fila

#### Banco

Guarda estado permanente:

- usuarios
- produtos
- pedidos
- historico

#### Fila

Guarda trabalho temporario:

- pedido novo que precisa ser processado

### Como explicar isso

"O banco persiste os dados. A fila organiza o processamento assincrono. Um nao substitui o outro."

---

## 9. DLQ e retry dentro dessa arquitetura

No projeto tambem existe:

- retry
- dead-letter queue

Fila de erro:

```txt
pedidos.dlq
```

### Como funciona

- se o consumer falhar
- ele tenta novamente ate 3 vezes
- se continuar falhando
- a mensagem vai para `pedidos.dlq`

### Por que isso importa

Porque mostra resiliencia.

Nao e um fluxo fragil.

Existe tratamento para falha de processamento.

---

## 10. Como isso se conecta com o C4 na fala

### Jeito simples de explicar o diagrama

"No nivel 1 mostramos quem usa o sistema e os sistemas externos. No nivel 2 mostramos os containers reais da solucao: frontend, backend, banco, RabbitMQ e consumer. A conexao principal e que o frontend fala com a API, a API salva no banco e publica no RabbitMQ, e o consumer pega a mensagem para processar o pedido. Depois disso, o sistema usa Socket.IO para atualizar a interface."

---

## 11. Resumo final em uma frase

"O RabbitMQ conecta a API ao consumer, desacoplando a criacao do pedido do processamento assincrono e permitindo que o sistema continue responsivo e resiliente."

---

## 12. Resumo ultra curto para falar ao professor

"O frontend envia o pedido para a API. A API salva no banco e publica uma mensagem no RabbitMQ. O consumer escuta essa fila, processa o pedido em segundo plano e o backend atualiza a interface via Socket.IO."
