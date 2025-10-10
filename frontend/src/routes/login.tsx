import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setJwt } = useAuth()
  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        },
      )
      const data = await response.json()
      if (response.status === 200) {
        localStorage.setItem('shortlink_jwt', data.jwt)
        setJwt(data.jwt)
        navigate({ to: '/dashboard' })
      }
    } catch (error) {
      console.error(error)
      toast.error('Login failed', {
        position: 'top-center',
      })
    }
  }

  return (
    <div className=" flex flex-col gap-4 items-center justify-center min-h-screen absolute inset-0">
      <img src="/logo.png" alt="Logo" className="w-14 h-14" />

      <h2 className="text-sm">Sign in to your account to continue</h2>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="flex flex-col gap-2">
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            action=""
          >
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
              Sign in
            </Button>
          </form>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Don't have an account?{' '}
        <Link className="hover:underline hover:text-black" to="/signup">
          Sign up
        </Link>
      </div>
    </div>
  )
}
