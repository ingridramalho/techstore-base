import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  return (
    <article className="card sugestao-card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <div className="card-precos">
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <button className="botao" onClick={() => onAdicionar(produto)}>
        Comprar
      </button>
    </article>
  )
}
