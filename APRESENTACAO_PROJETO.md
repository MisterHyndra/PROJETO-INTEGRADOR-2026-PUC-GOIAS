# Apresentacao do Projeto - Paralelo 14 Cafes Especiais

## Visao Geral

O projeto **Paralelo 14 Cafes Especiais** e um e-commerce full-stack com foco em processamento assincrono de pedidos.

### Stack principal

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- ORM: Prisma: serve pra facilitar a comunicação entre seu código e o banco de dados.
- Mensageria: RabbitMQ
- Atualizacao em tempo real: Socket.IO

### Objetivo tecnico

Demonstrar uma **solucao web distribuida com mensageria**, onde o pedido nao depende de processamento totalmente sincrono para seguir o fluxo.

---

## Como apresentar a arquitetura

### Fala curta

"Nosso sistema foi pensado como uma aplicacao web distribuida. O frontend em React cuida da experiencia do cliente e do administrador. O backend em Express centraliza a regra de negocio. O PostgreSQL persiste os dados. O RabbitMQ desacopla a criacao do pedido do processamento assincrono. E o Socket.IO atualiza a tela em tempo real."

### Estrutura do projeto

- `frontend/`
  Interface do usuario, catalogo, carrinho, checkout, conta e painel admin.
- `backend/src/domain`
  Entidades e regras centrais do negocio.
- `backend/src/application`
  Casos de uso, como criar pedido e atualizar status.
- `backend/src/infrastructure`
  Banco de dados, RabbitMQ e WebSocket.
- `backend/src/interfaces/routes`
  Rotas HTTP da API.

### Como justificar a arquitetura

Vocês podem dizer:

"A arquitetura adotada separa bem dominio, aplicacao, infraestrutura e interface. Isso melhora manutencao, facilita testes e deixa a mensageria desacoplada da camada web. Essa organizacao foi escolhida porque o sistema precisa integrar banco, fila e WebSocket sem misturar responsabilidade."

---

## Design Patterns usados

### Repository Pattern

Abstrai o acesso ao banco.

Exemplos:

- [ClienteRepository.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\db\ClienteRepository.js)
- [PedidoRepository.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\db\PedidoRepository.js)
- [ProdutoRepository.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\db\ProdutoRepository.js)

### Strategy Pattern

Usado para calculo de frete.

Exemplo:

- [CriarPedidoUseCase.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\application\CriarPedidoUseCase.js)

### Adapter Pattern

Usado para integrar tecnologias externas com o dominio.

Exemplos:

- [RabbitMQProducer.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\messaging\RabbitMQProducer.js)
- [OrderConsumer.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\messaging\OrderConsumer.js)
- [SocketIOAdapter.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\websocket\SocketIOAdapter.js)

### Observer / Event-driven

Usado para refletir mudanca de status em tempo real via Socket.IO.

---

## Como explicar a parte web

### Fala curta

"O frontend foi construido em React e consome a API REST do backend. O usuario pode navegar no catalogo, autenticar, montar o carrinho e finalizar pedidos. O administrador pode acessar um painel para gerenciar produtos e pedidos. Quando o pedido muda de status, a interface e atualizada em tempo real."

### Rotas importantes

- `/`
- `/catalogo`
- `/produto/:id`
- `/carrinho`
- `/checkout`
- `/minha-conta`
- `/admin`

---

## Como explicar a mensageria

### Fala curta

"O RabbitMQ funciona como broker de mensagens. Quando um pedido e criado, a API publica uma mensagem em uma fila. Um consumer escuta essa fila e processa o pedido assincronamente. Isso desacopla o fluxo e evita travar a resposta para o usuario."

### Arquivos principais

- Producer: [RabbitMQProducer.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\messaging\RabbitMQProducer.js)
- Consumer: [OrderConsumer.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\messaging\OrderConsumer.js)
- Integracao geral: [index.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\index.js)

---

## Como funciona a fila no projeto

### Fluxo do pedido

1. O cliente faz login e escolhe os produtos.
2. O frontend envia `POST /api/pedidos`.
3. O backend valida os itens e calcula subtotal, frete e total.
4. O pedido e salvo no banco com status inicial.
5. A API publica uma mensagem na fila `pedidos.novos`.
6. O consumer escuta essa fila.
7. O consumer busca o pedido no banco.
8. O status e atualizado para `SEPARANDO`.
9. O estoque dos produtos e reduzido.
10. O status e atualizado para `ENVIADO`.
11. O sistema emite evento via Socket.IO.
12. O frontend recebe o evento e atualiza a tela.

### Fala curta para esse fluxo

"A API cria e salva o pedido, mas o processamento principal vai para a fila. O consumer assume esse trabalho depois, atualiza status e estoque, e em seguida notifica a interface em tempo real."

---

## DLQ e retry

### Como explicar

"Para tratar falhas, o consumer tenta reprocessar a mensagem ate 3 vezes. Se continuar falhando, ela vai para a dead-letter queue `pedidos.dlq`. Assim o sistema fica mais resiliente e nao perde mensagem silenciosamente."

### Termos que vale citar

- fila principal: `pedidos.novos`
- dead-letter queue: `pedidos.dlq`
- retry: ate 3 tentativas

---

## Como explicar o WebSocket

### Fala curta

"Depois que o consumer atualiza o pedido, o backend emite um evento via Socket.IO. O cliente conectado recebe esse evento e enxerga a mudanca de status sem precisar atualizar a pagina."

### Arquivo principal

- [SocketIOAdapter.js](C:\Users\pvpne\OneDrive\Desktop\FACU-2026\PROJETO-INTEGRADOR\backend\src\infrastructure\websocket\SocketIOAdapter.js)

---

## Como explicar a qualidade

### Fala curta

"Na parte de qualidade, o projeto possui autenticacao com JWT, refresh token, organizacao por responsabilidade, testes unitarios no backend e estrutura pronta para evolucao."

### Pontos que podem ser citados

- JWT + refresh token
- testes unitarios no backend
- organizacao em camadas
- regra de negocio isolada em casos de uso
- mensageria desacoplada da camada web

----------

## Roteiro de fala - 5 minutos

### 1. Abertura

"Nosso projeto se chama Paralelo 14 Cafes Especiais. Ele simula um e-commerce de cafes de origem e foi desenvolvido como uma solucao web distribuida com mensageria."

### 2. Arquitetura

"No frontend usamos React para a experiencia do cliente e do admin. No backend usamos Node.js com Express. Para persistencia usamos PostgreSQL com Prisma. Para mensageria usamos RabbitMQ e, para atualizacao em tempo real, Socket.IO."

### 3. Organizacao do codigo

"Organizamos o backend em dominio, aplicacao, infraestrutura e interfaces. Assim, a regra de negocio fica separada da camada HTTP, do banco e da mensageria."

### 4. Fluxo tecnico do pedido

"Quando o usuario cria um pedido, a API valida os dados, persiste o pedido e publica uma mensagem na fila `pedidos.novos`. Um consumer escuta essa fila, atualiza o status do pedido, reduz o estoque e envia eventos via WebSocket para refletir isso na tela."

### 5. Resiliencia

"Tambem implementamos retry e dead-letter queue. Se o processamento falhar, o sistema tenta novamente e, se continuar falhando, a mensagem vai para `pedidos.dlq`."

### 6. Encerramento

"Com isso, o sistema atende ao objetivo do semestre, que e demonstrar uma aplicacao web com processamento assincrono desacoplado, arquitetura organizada e atualizacao em tempo real."

---

## Roteiro de demo ao vivo

### Antes de apresentar

Na raiz do projeto:

```powershell
docker compose up -d
```

No backend:

```powershell
npm start
```

No frontend:

```powershell
npm run dev
```

### RabbitMQ Management

Abrir:

- `http://localhost:15672`

Login:

- usuario: `admin`
- senha: `admin`

### Contas para demonstracao

Admin:

- email: `admin@paralelo14.com`
- senha: `admin123`

Cliente demo:

- email: `joao@exemplo.com`
- senha: `demo123`

### Ordem sugerida da demonstracao

1. Mostrar a home e o catalogo.
2. Fazer login com usuario comum.
3. Adicionar produto ao carrinho.
4. Finalizar pedido.
5. Mostrar que o pedido foi criado.
6. Abrir RabbitMQ Management e mostrar a fila.
7. Mostrar a atualizacao de status no frontend.
8. Fazer login como admin.
9. Mostrar o painel admin.
10. Mostrar produtos e pedidos.

---

## O que falar ao mostrar o RabbitMQ

"Aqui estamos vendo o broker RabbitMQ. A fila principal do projeto e a `pedidos.novos`, onde a API publica os pedidos novos. Se houver falha repetida no processamento, usamos a `pedidos.dlq` como dead-letter queue."

---

## Como demonstrar RabbitMQ ao vivo

### Objetivo da demonstracao

Mostrar que:

- a API realmente publica mensagens
- existe uma fila real no broker
- existe um consumer processando
- o pedido nao depende de processamento totalmente sincrono
- o sistema possui DLQ para falhas

### Passo a passo prático

#### 1. Suba os servicos

Na raiz:

```powershell
docker compose up -d
```

No backend:

```powershell
npm start
```

No frontend:

```powershell
npm run dev
```

#### 2. Abra o painel do RabbitMQ

No navegador:

```txt
http://localhost:15672
```

Login:

- usuario: `admin`
- senha: `admin`

#### 3. Va para as filas

No menu do RabbitMQ:

- `Queues and Streams`

Procure:

- `pedidos.novos`
- `pedidos.dlq`

#### 4. Explique o que aparece na tela

Ao mostrar a fila, voce pode falar:

"Essa e a fila principal `pedidos.novos`. E aqui que a API coloca um novo pedido quando o cliente finaliza a compra. O consumer escuta essa fila e consome a mensagem."

Se mostrar a DLQ:

"Essa e a dead-letter queue `pedidos.dlq`. Se uma mensagem falhar varias vezes no processamento, ela vem para ca."

#### 5. Gere um pedido ao vivo

No frontend:

1. entre com um usuario comum
2. adicione um produto no carrinho
3. finalize o pedido

#### 6. Mostre os efeitos

Durante ou logo depois do pedido, mostre:

- backend logando publicacao da mensagem
- fila `pedidos.novos`
- consumer processando
- status atualizando na tela

### O que dizer nesse momento

"Nesse momento o frontend enviou o pedido para a API. A API salvou o pedido no banco e publicou uma mensagem na fila `pedidos.novos`. O consumer capturou essa mensagem, atualizou o status do pedido e reduziu o estoque. Depois disso, o frontend recebeu o evento via Socket.IO."

### Se a fila esvaziar muito rapido

Isso pode acontecer porque o consumer esta consumindo imediatamente.

Voce pode explicar assim:

"A mensagem entra na fila, mas como o consumer ja esta ativo, ela e processada quase instantaneamente. Por isso nem sempre da tempo de ver a fila cheia por muito tempo."

### Onde observar isso no RabbitMQ

Na fila, voce pode mencionar:

- `Ready`: mensagens esperando consumo
- `Unacked`: mensagens entregues ao consumer, mas ainda nao confirmadas
- `Total`: total momentaneo de mensagens

### Evidencias tecnicas para mostrar

#### No backend

Logs como:

- `Pedido publicado na fila: ...`
- `Consumer aguardando pedidos...`
- `Consumer conectado ao RabbitMQ`

#### No RabbitMQ

- existencia da fila `pedidos.novos`
- existencia da fila `pedidos.dlq`

#### No frontend

- pedido criado
- status alterado
- atualizacao em tempo real

### Se quiser demonstrar falha

Se o professor pedir explicacao sobre falha, diga:

"Se houver erro no processamento, a mensagem e reenfileirada ate 3 vezes. Se continuar falhando, ela vai para a dead-letter queue."

Se nao quiser forcar erro ao vivo, apenas explique conceitualmente. E melhor do que arriscar a demo.

---

## Perguntas especificas sobre mensageria

### 1. O que exatamente vai na mensagem?

"Hoje publicamos os identificadores principais do pedido, como `pedidoId` e `clienteId`. O consumer usa esse ID para buscar os dados completos no banco e processar com seguranca."

### 2. Por que nao processar tudo direto na rota HTTP?

"Porque isso deixaria o fluxo acoplado e mais lento. Com mensageria, a API responde antes e o processamento continua em segundo plano."

### 3. Qual a vantagem de usar RabbitMQ nesse projeto?

"Ele desacopla produtor e consumidor, melhora escalabilidade e permite tratamento de falhas com retry e dead-letter queue."

### 4. Quem e o produtor e quem e o consumidor?

"O produtor e a API, quando cria o pedido e publica na fila. O consumidor e o worker que escuta a fila e continua o processamento."

### 5. Como o consumer sabe o que processar?

"Ele escuta a fila `pedidos.novos`, recebe a mensagem, extrai o `pedidoId` e busca o pedido no banco."

### 6. O pedido pode se perder?

"A ideia da fila duravel e justamente reduzir esse risco. Alem disso, implementamos retry e dead-letter queue para falhas de processamento."

### 7. O que significa dar `ack` na mensagem?

"Significa que o consumer confirmou para o broker que a mensagem foi tratada. So depois disso ela sai definitivamente do fluxo da fila."

### 8. O que acontece se o consumer falhar antes do `ack`?

"A mensagem pode ser reenfileirada ou continuar pendente dependendo do momento da falha. Isso ajuda a evitar perda de processamento."

### 9. O que e a dead-letter queue?

"E uma fila separada usada para mensagens que falharam repetidamente. No nosso projeto ela se chama `pedidos.dlq`."

### 10. Por que usar retry antes da DLQ?

"Porque algumas falhas podem ser temporarias. O retry tenta recuperar automaticamente sem exigir intervencao manual."

### 11. Como voces limitaram o retry?

"No consumer, a mensagem carrega um contador `x-retries`. Quando passa do limite de 3 tentativas, ela e enviada para a DLQ."

### 12. Onde entra o banco nesse fluxo?

"O banco persiste o pedido e serve como fonte de verdade. A fila nao substitui o banco; ela orquestra o processamento assincrono."

### 13. O que prova que a aplicacao e realmente distribuida?

"Temos componentes com responsabilidades separadas: frontend, API, banco, broker de mensagens e consumer. O processamento do pedido nao fica preso a uma unica chamada HTTP."

### 14. O que acontece se o RabbitMQ estiver fora do ar?

"No estado atual do projeto, o backend depende do RabbitMQ para subir corretamente, justamente para garantir aderencia ao requisito de mensageria."

### 15. Como voces mostram que o processamento foi assincrono?

"Porque o pedido e criado e publicado na fila, e o restante do trabalho acontece no consumer, separado da rota HTTP original."

### 16. Qual a diferenca entre fila e WebSocket no projeto?

"A fila serve para comunicacao assincrona entre backend e consumer. O WebSocket serve para notificar o frontend em tempo real depois que o processamento aconteceu."

### 17. Se o professor perguntar 'onde esta o stream?'

"No nosso caso usamos mensageria com RabbitMQ. O documento permite mensageria e/ou streams. Escolhemos mensageria porque se encaixava melhor no fluxo de pedidos assincronos."

### 18. Como eu resumiria a mensageria em uma frase?

"A mensageria permite transformar o pedido em um trabalho assincrono, desacoplado da requisicao do usuario."

---

## O que mostrar no painel admin

No painel admin, voces podem destacar:

- dashboard geral
- quantidade de pedidos
- produtos cadastrados
- alteracao de status de pedidos
- estado do broker RabbitMQ

---

## Possiveis perguntas da banca e respostas curtas

### 1. Por que usar RabbitMQ?

"Porque queriamos desacoplar a criacao do pedido do processamento. Assim a API responde mais rapido e o trabalho pesado vai para o consumer."

### 2. O que aconteceria sem mensageria?

"O backend teria que processar tudo de forma sincrona no momento da requisicao, deixando o fluxo mais acoplado e menos resiliente."

### 3. Onde esta o processamento assincrono?

"No consumer do RabbitMQ, que consome a fila `pedidos.novos`, atualiza status e reduz estoque."

### 4. Como voces trataram falhas?

"Com retry e dead-letter queue. Depois de 3 tentativas, a mensagem vai para `pedidos.dlq`."

### 5. Onde entra o WebSocket?

"Depois que o consumer processa a mensagem, o backend emite um evento via Socket.IO para refletir a mudanca na interface."

### 6. Quais patterns voces aplicaram?

"Repository, Strategy, Adapter, Observer/Event-driven e injecao de dependencias por construtor."

### 7. Qual foi o papel do banco?

"Persistir usuarios, produtos, pedidos, itens do pedido, tokens e historico de status."

### 8. Por que essa arquitetura e adequada?

"Porque o projeto precisa integrar varias tecnologias externas sem misturar tudo na camada web: banco, mensageria e tempo real. A separacao melhora manutencao e testabilidade."

### 9. O que diferencia o projeto de um CRUD simples?

"O fluxo assincrono com RabbitMQ, atualizacao em tempo real via Socket.IO e o tratamento de falhas com retry e DLQ."

### 10. Como testar rapidamente que a mensageria funciona?

"Criando um pedido, observando a publicacao na fila, o consumo pelo worker e a mudanca de status na tela."

---

## Observacao importante para a banca

Se perguntarem sobre Spring Boot:

"O documento usa Spring Boot como exemplo de stack, mas o requisito principal e construir uma solucao web full-stack distribuida com mensageria, arquitetura organizada e processamento assincrono. Nosso projeto atende isso com React, Node.js, PostgreSQL, RabbitMQ e Socket.IO."

---

## Fechamento rapido

"Nosso projeto entrega uma aplicacao web full-stack com mensageria real, fluxo assincrono de pedidos, atualizacao em tempo real, backend organizado por responsabilidades e uma interface alinhada ao conceito visual da marca."
