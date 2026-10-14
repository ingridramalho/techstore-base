// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Preço</th>
              <th>Quem está esperando</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const clientesEsperando = listaEspera.filter((item) => item.produtoId === produto.id)
              const semPreco = Number(produto.price) <= 0

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>{semPreco ? <span className="selo selo-alerta">Sem preço</span> : `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}`}</td>
                  <td>
                    {clientesEsperando.length === 0 ? (
                      <span>Nenhum</span>
                    ) : (
                      clientesEsperando.map((cliente) => (
                        <div key={`${produto.id}-${cliente.email}`}>
                          {cliente.nome} — {cliente.email}
                        </div>
                      ))
                    )}
                  </td>
                  <td>
                    {semPreco && <span className="selo selo-alerta">Sem preço</span>}
                    {!semPreco && produto.estoque === 0 && (
                      <span className="selo selo-esgotado">Esgotado</span>
                    )}
                    {!semPreco && produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {!semPreco && produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
