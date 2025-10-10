import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { useLocation } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
export const Header = () => {
  const location = useLocation()
  const { jwt, setJwt } = useAuth()
  const navigate = useNavigate()

  if (location.pathname === '/login' || location.pathname === '/signup')
    return null

  if (jwt) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Link to="/" className="flex-1 font-semibold text-xl cursor-pointer">
          Shorrtl.ink
        </Link>
        {location.pathname === '/dashboard' ||
        location.pathname.includes('analytics') ? (
          <Button
            onClick={() => {
              localStorage.removeItem('shortlink_jwt')
              setJwt(null)
              navigate({ to: '/login' })
            }}
            className="cursor-pointer"
          >
            Signout
          </Button>
        ) : (
          <Button
            onClick={() => {
              navigate({ to: '/dashboard' })
            }}
            className="cursor-pointer"
          >
            Go to Dashboard
          </Button>
        )}
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
