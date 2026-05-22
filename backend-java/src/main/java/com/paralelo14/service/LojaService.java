package com.paralelo14.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.amqp.AmqpException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.paralelo14.domain.entity.Avaliacao;
import com.paralelo14.domain.entity.Cliente;
import com.paralelo14.domain.entity.ItemPedido;
import com.paralelo14.domain.entity.Pedido;
import com.paralelo14.domain.entity.PedidoStatusHistorico;
import com.paralelo14.domain.entity.Produto;
import com.paralelo14.domain.entity.RefreshToken;
import com.paralelo14.domain.enums.Role;
import com.paralelo14.domain.enums.StatusPedido;
import com.paralelo14.messaging.PedidoProducer;
import com.paralelo14.repository.AvaliacaoRepository;
import com.paralelo14.repository.ClienteRepository;
import com.paralelo14.repository.PedidoRepository;
import com.paralelo14.repository.ProdutoRepository;
import com.paralelo14.repository.RefreshTokenRepository;
import com.paralelo14.security.JwtService;
import com.paralelo14.service.dto.AuthResult;
import com.paralelo14.service.dto.AvaliacoesResumo;
import com.paralelo14.service.dto.ClienteResumo;
import com.paralelo14.service.dto.CriarPedidoInput;
import com.paralelo14.service.dto.DashboardStats;
import com.paralelo14.service.dto.PedidoEvento;
import com.paralelo14.service.dto.PedidoItemInput;
import com.paralelo14.service.dto.ProdutoFiltro;
import com.paralelo14.service.dto.RefreshResult;
import com.paralelo14.websocket.SocketGateway;

@Service
public class LojaService {

    private static final Map<String, BigDecimal> FRETES = Map.of(
        "SEDEX", new BigDecimal("25.90"),
        "PAC", new BigDecimal("12.90"),
        "RETIRADA", BigDecimal.ZERO
    );

    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PedidoProducer pedidoProducer;
    private final SocketGateway socketGateway;
    private final SecureRandom secureRandom = new SecureRandom();

    public LojaService(
        ClienteRepository clienteRepository,
        ProdutoRepository produtoRepository,
        PedidoRepository pedidoRepository,
        AvaliacaoRepository avaliacaoRepository,
        RefreshTokenRepository refreshTokenRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        PedidoProducer pedidoProducer,
        SocketGateway socketGateway
    ) {
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
        this.pedidoRepository = pedidoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.pedidoProducer = pedidoProducer;
        this.socketGateway = socketGateway;
    }

    @Transactional
    public AuthResult cadastrarCliente(String nome, String email, String senha, String cpf, String telefone) {
        if (clienteRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        if (clienteRepository.findByCpf(cpf).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(nome);
        cliente.setEmail(email);
        cliente.setSenhaHash(passwordEncoder.encode(senha));
        cliente.setCpf(cpf);
        cliente.setTelefone(telefone);
        cliente.setRole(Role.CLIENTE);

        Cliente salvo = clienteRepository.save(cliente);
        String refreshTokenValue = gerarRefreshToken();
        salvarRefreshToken(salvo, refreshTokenValue);

        return new AuthResult(
            jwtService.generateToken(salvo),
            refreshTokenValue,
            toResumo(salvo)
        );
    }

    @Transactional
    public AuthResult autenticar(String email, String senha) {
        Cliente cliente = clienteRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(senha, cliente.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        refreshTokenRepository.deleteByClienteId(cliente.getId());
        String refreshTokenValue = gerarRefreshToken();
        salvarRefreshToken(cliente, refreshTokenValue);

        return new AuthResult(
            jwtService.generateToken(cliente),
            refreshTokenValue,
            toResumo(cliente)
        );
    }

    @Transactional(readOnly = true)
    public Cliente buscarClientePorId(String clienteId) {
        return clienteRepository.findById(clienteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    @Transactional
    public RefreshResult refresh(String refreshToken) {
        RefreshToken persisted = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido ou expirado"));

        if (persisted.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido ou expirado");
        }

        Cliente cliente = persisted.getCliente();
        refreshTokenRepository.deleteByClienteId(cliente.getId());
        String novoRefreshToken = gerarRefreshToken();
        salvarRefreshToken(cliente, novoRefreshToken);

        return new RefreshResult(
            jwtService.generateToken(cliente),
            novoRefreshToken,
            toResumo(cliente)
        );
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.deleteByToken(refreshToken);
        }
    }

    @Transactional(readOnly = true)
    public List<Produto> listarProdutos(ProdutoFiltro filtro) {
        BigDecimal precoMin = Optional.ofNullable(filtro.precoMin()).orElse(BigDecimal.ZERO);
        BigDecimal precoMax = Optional.ofNullable(filtro.precoMax()).orElse(new BigDecimal("999999.99"));

        return produtoRepository.findAllByOrderByNomeAsc().stream()
            .filter(Produto::getAtivo)
            .filter(produto -> filtro.torra() == null || filtro.torra().isBlank() || equalsIgnoreCase(produto.getTorra(), filtro.torra()))
            .filter(produto -> filtro.processo() == null || filtro.processo().isBlank() || equalsIgnoreCase(produto.getProcesso(), filtro.processo()))
            .filter(produto -> produto.getPreco().compareTo(precoMin) >= 0 && produto.getPreco().compareTo(precoMax) <= 0)
            .toList();
    }

    @Transactional(readOnly = true)
    public Produto buscarProdutoPorId(String id) {
        return produtoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAllByOrderByNomeAsc();
    }

    @Transactional
    public Produto criarProduto(Produto produto) {
        produto.setId(null);
        produto.setAtivo(Boolean.TRUE);
        return produtoRepository.save(produto);
    }

    @Transactional
    public Produto atualizarProduto(String id, Produto payload) {
        Produto produto = buscarProdutoPorId(id);
        produto.setNome(payload.getNome());
        produto.setDescricao(payload.getDescricao());
        produto.setPreco(payload.getPreco());
        produto.setEstoque(payload.getEstoque());
        produto.setOrigem(payload.getOrigem());
        produto.setAltitudeM(payload.getAltitudeM());
        produto.setProcesso(payload.getProcesso());
        produto.setTorra(payload.getTorra());
        produto.setImagemUrl(payload.getImagemUrl());
        if (payload.getAtivo() != null) {
            produto.setAtivo(payload.getAtivo());
        }
        return produtoRepository.save(produto);
    }

    @Transactional
    public void removerProduto(String id) {
        Produto produto = buscarProdutoPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    @Transactional
    public Pedido criarPedido(CriarPedidoInput input) {
        if (input.itens() == null || input.itens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrinho vazio");
        }

        Cliente cliente = buscarClientePorId(input.clienteId());
        BigDecimal subtotal = BigDecimal.ZERO;
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(StatusPedido.PROCESSANDO);
        pedido.setMetodoPagamento(input.metodoPagamento() == null || input.metodoPagamento().isBlank() ? "CARTAO" : input.metodoPagamento());
        String tipoFrete = input.tipoFrete() == null || input.tipoFrete().isBlank() ? "PAC" : input.tipoFrete().toUpperCase();
        pedido.setTipoFrete(tipoFrete);

        for (PedidoItemInput itemInput : input.itens()) {
            Produto produto = buscarProdutoPorId(itemInput.produtoId());
            if (produto.getEstoque() < itemInput.quantidade()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estoque insuficiente para: " + produto.getNome());
            }

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setQuantidade(itemInput.quantidade());
            itemPedido.setPrecoUnitario(produto.getPreco());
            pedido.getItens().add(itemPedido);

            subtotal = subtotal.add(produto.getPreco().multiply(BigDecimal.valueOf(itemInput.quantidade())));
        }

        BigDecimal frete = FRETES.getOrDefault(tipoFrete, FRETES.get("PAC"));
        BigDecimal total = subtotal.add(frete).setScale(2, RoundingMode.HALF_UP);
        pedido.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        pedido.setFrete(frete.setScale(2, RoundingMode.HALF_UP));
        pedido.setTotal(total);

        PedidoStatusHistorico historico = new PedidoStatusHistorico();
        historico.setPedido(pedido);
        historico.setStatus(StatusPedido.PROCESSANDO);
        historico.setOrigem("API");
        pedido.getHistoricoStatus().add(historico);

        Pedido salvo = pedidoRepository.save(pedido);

        try {
            pedidoProducer.publish(new PedidoEvento(salvo.getId(), salvo.getCliente().getId()));
        } catch (AmqpException ex) {
            // fallback gracioso
        }

        return buscarPedidoPorId(salvo.getId());
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarPedidos(String clienteId, boolean admin) {
        return admin ? pedidoRepository.findAllByOrderByCreatedAtDesc() : pedidoRepository.findByClienteIdOrderByCreatedAtDesc(clienteId);
    }

    @Transactional(readOnly = true)
    public Pedido buscarPedidoPorId(String pedidoId) {
        return pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    @Transactional
    public Pedido atualizarStatusPedido(String pedidoId, StatusPedido novoStatus, String origem) {
        Pedido pedido = buscarPedidoPorId(pedidoId);
        pedido.setStatus(novoStatus);

        PedidoStatusHistorico historico = new PedidoStatusHistorico();
        historico.setPedido(pedido);
        historico.setStatus(novoStatus);
        historico.setOrigem(origem);
        pedido.getHistoricoStatus().add(historico);

        Pedido salvo = pedidoRepository.save(pedido);
        socketGateway.emitirStatusPedido(salvo.getId(), salvo.getStatus().name(), salvo.getCliente().getId());
        return buscarPedidoPorId(salvo.getId());
    }

    @Transactional
    public void cancelarPedido(String pedidoId) {
        atualizarStatusPedido(pedidoId, StatusPedido.CANCELADO, "API");
    }

    @Transactional
    public void processarPedidoFila(String pedidoId) {
        Pedido pedido = buscarPedidoPorId(pedidoId);
        atualizarStatusPedido(pedidoId, StatusPedido.SEPARANDO, "CONSUMER");

        for (ItemPedido item : pedido.getItens()) {
            Produto produto = item.getProduto();
            if (produto.getEstoque() < item.getQuantidade()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estoque insuficiente para: " + produto.getNome());
            }
            produto.setEstoque(produto.getEstoque() - item.getQuantidade());
            produtoRepository.save(produto);
        }

        atualizarStatusPedido(pedidoId, StatusPedido.ENVIADO, "CONSUMER");
    }

    @Transactional
    public Avaliacao avaliarProduto(String clienteId, String produtoId, Integer nota, String comentario) {
        if (nota == null || nota < 1 || nota > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nota deve ser entre 1 e 5");
        }

        Cliente cliente = buscarClientePorId(clienteId);
        Produto produto = buscarProdutoPorId(produtoId);

        Avaliacao avaliacao = avaliacaoRepository.findByClienteIdAndProdutoId(clienteId, produtoId)
            .orElseGet(Avaliacao::new);

        avaliacao.setCliente(cliente);
        avaliacao.setProduto(produto);
        avaliacao.setNota(nota);
        avaliacao.setComentario(comentario);

        try {
            return avaliacaoRepository.save(avaliacao);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não foi possível salvar a avaliação");
        }
    }

    @Transactional(readOnly = true)
    public AvaliacoesResumo listarAvaliacoesPorProduto(String produtoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByProdutoIdOrderByCreatedAtDesc(produtoId);
        double media = avaliacoes.stream().mapToInt(Avaliacao::getNota).average().orElse(0.0);
        media = BigDecimal.valueOf(media).setScale(1, RoundingMode.HALF_UP).doubleValue();
        return new AvaliacoesResumo(avaliacoes, media, avaliacoes.size());
    }

    @Transactional(readOnly = true)
    public DashboardStats dashboardStats() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        List<Produto> produtos = produtoRepository.findAllByOrderByNomeAsc();
        LocalDateTime inicioHoje = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);

        long pedidosHoje = pedidos.stream().filter(p -> p.getCreatedAt().isAfter(inicioHoje) || p.getCreatedAt().isEqual(inicioHoje)).count();
        BigDecimal receitaTotal = pedidos.stream()
            .filter(p -> p.getStatus() != StatusPedido.CANCELADO)
            .map(Pedido::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .setScale(2, RoundingMode.HALF_UP);
        long totalProdutosAtivos = produtos.stream().filter(Produto::getAtivo).count();
        long estoqueBaixo = produtos.stream().filter(p -> Boolean.TRUE.equals(p.getAtivo()) && p.getEstoque() <= 10).count();
        long pedidosProcessando = pedidos.stream().filter(p -> p.getStatus() == StatusPedido.PROCESSANDO).count();

        return new DashboardStats(
            pedidos.size(),
            pedidosHoje,
            receitaTotal.toPlainString(),
            totalProdutosAtivos,
            estoqueBaixo,
            pedidosProcessando,
            pedidoProducer.isConnected()
        );
    }

    private ClienteResumo toResumo(Cliente cliente) {
        return new ClienteResumo(cliente.getId(), cliente.getNome(), cliente.getEmail(), cliente.getRole().name());
    }

    private boolean equalsIgnoreCase(String left, String right) {
        return left != null && right != null && left.equalsIgnoreCase(right);
    }

    private String gerarRefreshToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private void salvarRefreshToken(Cliente cliente, String tokenValue) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setCliente(cliente);
        refreshToken.setToken(tokenValue);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(refreshToken);
    }
}
