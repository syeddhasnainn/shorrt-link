import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'

type AuthContextType = {
  jwt: string | null
  setJwt: any
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [jwt, setJwt] = useState(localStorage.getItem('shortlink_jwt'))

  useEffect(() => {
    if (!jwt && location.pathname === '/dashboard') {
      navigate({ to: '/login' })
    }
  }, [])

  const value = { jwt, setJwt }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside an auth provider')
  }

  return ctx
}
