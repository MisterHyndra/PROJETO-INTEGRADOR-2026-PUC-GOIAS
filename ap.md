User: Nosso projeto atual está usando bootstrap?
se sim qual parte do codigo?

ou estamos usando oq para deixar responsive?


GitHub Copilot: Searched for text `bootstrap`, no results

Searched for text `Bootstrap`, no results

Searched for regex `tailwind|responsive|className|@import 'tailwindcss` (`**/frontend/**`), 30 results

Seu projeto **não está usando Bootstrap**. Em vez disso, a responsividade e o design visual estão sendo feitos com **Tailwind CSS**.

- O Tailwind está configurado em todo o frontend (veja arquivos como frontend/tailwind.config.js, frontend/postcss.config.js, e as diretivas @tailwind em index.css).
- As classes utilitárias do Tailwind (ex: `flex`, `grid`, `px-4`, `md:flex-row`, etc.) são usadas nos componentes e páginas para garantir responsividade e estilização.

Portanto, o layout responsivo e o visual do projeto são feitos com **Tailwind CSS** e não com Bootstrap.

User: Me gere um md para eu falar na banca hoje 
qual stack estamos usando, arquitetura de software ou estrutura de dados:
=
como funciona a parte de mensageria e oq acha que pode cair analisando o nosso projeto,



GitHub Copilot: Optimizing tool selection...Segue um texto em markdown para você usar na banca, cobrindo stack, arquitetura, estrutura de dados, mensageria e possíveis perguntas:

---

# Apresentação Técnica – Paralelo 14 Cafés Especiais

## Stack Utilizada

- **Frontend:** React + Vite + Tailwind CSS (responsividade e design)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Mensageria:** RabbitMQ
- **Tempo Real:** Socket.IO

## Arquitetura de Software

Adotamos uma arquitetura em camadas, separando:

- **Domínio:** entidades e regras de negócio
- **Aplicação:** casos de uso (ex: criar pedido, autenticar cliente)
- **Infraestrutura:** acesso a banco (repositories), mensageria (RabbitMQ), WebSocket
- **Interfaces:** rotas HTTP (API REST)

Essa separação facilita manutenção, testes e desacopla as responsabilidades.

### Padrões de Projeto

- **Repository:** abstrai acesso ao banco (ex: ClienteRepository)
- **Strategy:** cálculo de frete
- **Adapter:** integrações externas (RabbitMQ, Socket.IO)
- **Observer/Event-driven:** atualização em tempo real via eventos

## Estrutura de Dados

- **Cliente, Produto, Pedido, Avaliação:** entidades principais
- **Pedido:** contém status, itens, histórico, vinculado ao cliente
- **Mensagens na fila:** carregam identificadores (ex: pedidoId, clienteId) para processamento assíncrono

## Mensageria – Como Funciona

1. Cliente faz pedido no frontend.
2. API backend valida, salva no banco e publica mensagem na fila `pedidos.novos` (RabbitMQ).
3. Um consumer escuta essa fila, processa o pedido (atualiza status, reduz estoque).
4. Se falhar, tenta até 3 vezes (retry). Persistindo o erro, envia para a dead-letter queue `pedidos.dlq`.
5. Após processar, backend emite evento via Socket.IO para o frontend atualizar a tela em tempo real.

### Vantagens

- Desacoplamento entre criação e processamento do pedido
- Resiliência com retry e DLQ
- Escalabilidade e facilidade de manutenção

## O que pode cair na banca

- **Por que usar RabbitMQ?**  
  Para desacoplar o fluxo, permitir processamento assíncrono e tratar falhas com retry/DLQ.

- **O que vai na mensagem?**  
  Identificadores principais (pedidoId, clienteId).

- **Por que não processar tudo direto na rota HTTP?**  
  Para evitar acoplamento e lentidão; mensageria permite resposta rápida e processamento em background.

- **Como funciona o retry/DLQ?**  
  Até 3 tentativas, depois mensagem vai para a dead-letter queue.

- **Qual a diferença entre fila e WebSocket?**  
  Fila é para backend/consumer, WebSocket é para notificar o frontend em tempo real.

- **O que acontece se o RabbitMQ cair?**  
  O backend depende do RabbitMQ para funcionar, garantindo aderência ao requisito de mensageria.

- **Como provar que é assíncrono?**  
  O pedido é criado e publicado na fila, e o restante do processamento ocorre fora da requisição HTTP original.

---

Se precisar de respostas rápidas para perguntas específicas, posso gerar também!