import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ClickIcon, CopyIcon, GotoIcon, SearchIcon } from '@/lib/icons'
import { jwtDecode } from 'jwt-decode'
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
  beforeLoad: () => {
    const jwt = localStorage.getItem('shortlink_jwt')

    if (!jwt) {
      throw redirect({ to: '/login', replace: true })
    }

    const { exp } = jwtDecode(jwt)

    const currentTime = Date.now() / 1000

    if (exp && exp < currentTime) {
      throw redirect({ to: '/login', replace: true })
    }
  },
})

function RouteComponent() {
  const [url, setUrl] = useState('')

  const { jwt } = useAuth()

  console.log('jwt from auth:', jwt)

  const API_URL = import.meta.env.VITE_API_URL

  const queryClient = useQueryClient()

  const { data: links } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/getUrls`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      const data = await response.json()
      return data.urls
    },
    initialData: [],
  })

  console.log(links)

  const mutation = useMutation({
    mutationFn: (newLink: string) => {
      return fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ link: newLink }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  return (
    <div>
      <section className=" mt-24">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 w-full justify-end">
            <div className="relative w-full max-w-sm ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon width={12} height={12} />
              </span>
              <Input
                value={url}
                onChange={(e: any) => setUrl(e.target.value)}
                className="shadow-none !bg-neutral-100 !border-neutral-300 placeholder:text-sm pl-9"
                placeholder="Enter URL"
              />
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => {
                mutation.mutate(url)
              }}
            >
              Create Link
            </Button>
          </div>
        </div>

        {links.length === 0 && (
          <div>
            <div className="flex flex-col gap-4 pt-8">
              <div className=" hover:bg-neutral-200 rounded-md transition-colors duration-200">
                <div className="flex items-center justify-between gap-2 border border-neutral-300 px-4 py-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium flex items-center gap-2 text-neutral-500">
                        No links found
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 pt-8">
          {links
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((link: any) => (
              <Link
                to={'/analytics/$id'}
                params={{ id: link.shortUrl }}
                key={link.id}
                className="cursor-default"
              >
                <div
                  key={link.id}
                  className=" hover:bg-neutral-200 rounded-md transition-colors duration-200"
                >
                  <div className="flex items-center justify-between gap-2 border border-neutral-300 px-4 py-3 rounded-md">
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium flex items-center gap-2">
                          {link.shortUrl}
                          <div className="cursor-pointer">
                            <CopyIcon width={14} height={14} />
                          </div>
                        </div>

                        <div className="text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <GotoIcon width={14} height={14} />
                            <div className="hover:underline cursor-pointer hover:text-neutral-700 transition-colors duration-200">
                              {link.originalUrl}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-neutral-400">
                        {new Date(link.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ClickIcon width={14} height={14} />
                        <span>{link.clickCount} clicks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
