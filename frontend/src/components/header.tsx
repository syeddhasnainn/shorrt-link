import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'

export const Header = () => {
  const jwt = localStorage.getItem('shortlink_jwt')

  if (jwt) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Link to="/" className="flex-1 font-semibold text-xl cursor-pointer">
          Shorrtl.ink
        </Link>
        <Link to="/dashboard">
          <Button className="cursor-pointer">Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex-1 font-semibold text-xl">Shorrtl.ink</div>
      <Link to="/login">
        <Button className="cursor-pointer">Login</Button>
      </Link>
    </div>
  )
}
