import { createContext, useContext, useEffect, useState } from 'react'
import { usePagamentoContext } from './Pagamento'
import { UsuarioContext } from './Usuario'

export const CarrinhoContext = createContext()
CarrinhoContext.displayName = 'Carrinho'

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([])
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0)
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0)

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho,
      }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    setValorTotalCarrinho,
  } = useContext(CarrinhoContext)

  const { formaPagamento } = usePagamentoContext()
  const { setSaldo } = useContext(UsuarioContext)

  const mudarQuantidade = (id, quantidade) => {
    return carrinho.map(itemDoCarrinho => {
      if (itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade
      return itemDoCarrinho
    })
  }

  const adicionarProduto = novoProduto => {
    const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id)
    if (!temOProduto) {
      novoProduto.quantidade = 1
      return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto])
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1))
  }

  const removerProduto = id => {
    const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id)
    const ehUltimo = produto.quantidade === 1
    if (ehUltimo) {
      return setCarrinho(carrinhoAnterior =>
        carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id)
      )
    }
    setCarrinho(mudarQuantidade(id, -1))
  }

  const efetuarCompra = () => {
    setCarrinho([])
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho)
  }

  useEffect(() => {
    const novoTotal = carrinho.reduce(
      (contador, produto) => contador + produto.quantidade * produto.valor,
      0
    )
    const novaQuantidade = carrinho.reduce((contador, produto) => contador + produto.quantidade, 0)
    setQuantidadeProdutos(novaQuantidade)
    setValorTotalCarrinho(novoTotal * formaPagamento.juros)
  }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento])

  return {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    adicionarProduto,
    removerProduto,
    valorTotalCarrinho,
    efetuarCompra,
  }
}
