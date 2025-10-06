import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/signup`,
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        },
      )
      if (response.status === 201) {
        toast.success('User signed up successfully', {
          position: 'top-center',
        })

        navigate({ to: '/login' })
      } else {
        const data = await response.json()
        toast.success(data.message, {
          position: 'top-center',
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('User signup failed', {
        position: 'top-center',
      })
    }
  }

  return (
    <div className="absolute inset-0 min-h-screen flex flex-col gap-4 items-center justify-center">
      <img src="/logo.png" alt="Logo" className="w-14 h-14" />

      <h2 className="text-sm">Create an account to continue</h2>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="flex flex-col gap-2">
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
        </div>
        <Button onClick={handleSignup}>Sign up</Button>
      </div>

      <div className="text-sm text-gray-500">
        Already have an account?{' '}
        <Link className="hover:underline hover:text-black" to="/login">
          Sign in
        </Link>
      </div>
    </div>
  )
}
