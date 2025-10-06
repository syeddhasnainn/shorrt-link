import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col items-center h-screen bg-neutral-50 fixed inset-0 top-16 overflow-hidden">
      <div className="space-y-2 pt-64 z-10">
        <div className="text-5xl font-bold">Shorten. Share. Track.</div>
        <p className="text-xl text-neutral-500 max-w-lg text-center">
          Turn long, messy links into sleek, shareable URLs in milliseconds.
        </p>
      </div>
      <div className="flex-1 w-full flex items-end justify-center pb-4 px-4 mt-8">
        <img
          className="max-w-7xl w-full max-h-full object-contain rounded-xl border-12"
          src="/landing.png"
          alt="landing"
        />
      </div>
    </div>
  )
}
