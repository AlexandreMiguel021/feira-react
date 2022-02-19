import { Nav } from './styles'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import { useCarrinhoContext } from 'common/context/Carrinho'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Link } from '@material-ui/core'

const NavBar = () => {
  const { quantidadeProdutos } = useCarrinhoContext()
  const history = useHistory()
  return (
    <Nav>
      <IconButton onClick={() => history.push('/carrinho')} disabled={!quantidadeProdutos}>
        <Badge color='primary' badgeContent={quantidadeProdutos}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Link href='/' underline='hover' variant='h6'>
        Login
      </Link>
    </Nav>
  )
}

export default NavBar
