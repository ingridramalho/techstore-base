import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

function normalizarProduto(produto) {
  if (!produto) return produto

  const precoNumerico = Number(produto.price)

  return {
    ...produto,
    price: Number.isFinite(precoNumerico) ? precoNumerico : 0,
  }
}

function produtoTemPrecoValido(produto) {
  return produto && Number(produto.price) > 0
}

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState([])
  const [mensagemCarrinho, setMensagemCarrinho] = useState('')

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados.map(normalizarProduto)))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  useEffect(() => {
    if (!mensagemCarrinho) {
      return undefined
    }

    const temporizador = setTimeout(() => {
      setMensagemCarrinho('')
    }, 2000)

    return () => clearTimeout(temporizador)
  }, [mensagemCarrinho])

  function adicionarAoCarrinho(produto) {
    if (!produtoTemPrecoValido(produto)) {
      return
    }

    setCarrinho((anterior) => anterior.concat(produto))
    setMensagemCarrinho(`${produto.title} adicionado ao carrinho!`)
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  function registrarInteresse({ produtoId, nome, email }) {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim()

    if (!nomeLimpo || !emailLimpo) {
      return false
    }

    setListaEspera((anterior) => {
      const jaExiste = anterior.some(
        (item) => item.produtoId === produtoId && item.email === emailLimpo
      )

      if (jaExiste) {
        return anterior
      }

      return [...anterior, { produtoId, nome: nomeLimpo, email: emailLimpo }]
    })

    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}
        {mensagemCarrinho && (
          <div className="carrinho-feedback" role="status" aria-live="polite">
            {mensagemCarrinho}
          </div>
        )}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarInteresse={registrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
