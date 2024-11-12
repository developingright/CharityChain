
import { Link } from 'react-router-dom'
import { Heart } from "lucide-react"
import { Button } from './ui/button'
import { useAuthContext } from '@/context/AuthContext'
import useLogout from '../hooks/useLogout'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
const Navbar = () => {
    const {authUser} = useAuthContext();
    const {logout}= useLogout();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center py-10">
        <Link className="flex items-center justify-center" to="/">
          <Heart className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">SolanaCharity</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/dashboard">
            Dashboard
          </Link>
          <WalletMultiButton />
          {!authUser ? <Link to='/login'>Login</Link> :<span className='cursor-pointer' onClick={logout}>Logout</span>}
        </nav>
      </header>
  )
}

export default Navbar
