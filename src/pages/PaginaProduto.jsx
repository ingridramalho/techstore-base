import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const produto = produtos.find((item) => item.id === id)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const semPreco = Number(produto.price) <= 0
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  function handleSubmit(evento) {
    evento.preventDefault()

    const registrado = onRegistrarInteresse({ produtoId: produto.id, nome, email })

    if (registrado) {
      setNome('')
      setEmail('')
      setMensagem('Você foi adicionado à lista de espera.')
    } else {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {produto.estoque === 0 && (
            <form className="cupom" onSubmit={handleSubmit}>
              <label htmlFor="nome-alerta" className="rotulo">
                Nome
              </label>
              <input
                id="nome-alerta"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />

              <label htmlFor="email-alerta" className="rotulo">
                E-mail
              </label>
              <input
                id="email-alerta"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="seu@email.com"
              />

              <button type="submit" className="botao botao-secundario">
                Avisar quando voltar
              </button>

              {mensagem && <p className="mensagem-cupom">{mensagem}</p>}
            </form>
          )}

          {produto.estoque > 0 && (
            <button
              className="botao botao-grande"
              onClick={() => onAdicionar(produto)}
              disabled={semPreco}
            >
              {semPreco ? 'Sem preço' : 'Adicionar ao carrinho'}
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
