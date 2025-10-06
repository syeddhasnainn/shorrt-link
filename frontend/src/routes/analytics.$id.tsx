import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ChartLineLinear } from '@/components/chart-line-linear'
import {
  ClickIcon,
  RedirectIcon,
  MobileIcon,
  TabletIcon,
  DesktopIcon,
} from '@/lib/icons'
import { jwtDecode } from 'jwt-decode'

export const Route = createFileRoute('/analytics/$id')({
  component: RouteComponent,
  beforeLoad: async () => {
    const jwt = localStorage.getItem('shortlink_jwt')

    if (!jwt) {
      throw redirect({ to: '/login' })
    }

    const { exp } = jwtDecode(jwt)

    const currentTime = Date.now() / 1000

    if (exp && exp < currentTime) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async ({ params }) => {
    const jwt = localStorage.getItem('shortlink_jwt')

    const request = await fetch(
      `${import.meta.env.VITE_API_URL}/api/getClickData`,
      {
        method: 'POST',
        body: JSON.stringify({ shortCode: params.id }),
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )

    const data = await request.json()

    return data
  },
})

type DeviceStatsType = {
  device: string
  count: number
}

function RouteComponent() {
  const { id } = Route.useParams()
  console.log('params', id)
  const data = Route.useLoaderData()

  console.log(data)

  // Helper function to convert country code to flag emoji
  const getCountryFlag = (countryCode: string) => {
    if (!countryCode) return ''
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const countryStats = data.clickData.reduce((acc: any, click: any) => {
    const country = click.country
    const countryCode = click.countryCode

    if (!acc[country]) {
      acc[country] = { country, countryCode, count: 0 }
    }

    acc[country].count += 1
    return acc
  }, {})

  const monthCountObject = data.clickData.reduce((acc: any, click: any) => {
    const date = new Date(click.createdAt)
    const month = date.toLocaleString('en-US', { month: 'short' })

    const day = date.getDate()

    const monthDay = `${month} ${day}`
    console.log(monthDay)

    if (!acc[monthDay]) {
      acc[monthDay] = {
        monthDay,
        count: 0,
        date,
      }
    }

    acc[monthDay].count += 1
    return acc
  }, {})

  const monthCountValues = Object.values(monthCountObject).sort(
    (a: any, b: any) => a.date - b.date,
  )

  console.log(monthCountObject)

  const countryStatResult = Object.values(countryStats)

  const deviceStats = data.clickData.reduce((acc: any, click: any) => {
    const device = click.deviceType

    if (!acc[device]) {
      acc[device] = { device, count: 0 }
    }

    acc[device].count += 1
    return acc
  }, {})

  const deviceStatResult: DeviceStatsType[] = Object.values(deviceStats)

  // Helper function to get device icon
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <MobileIcon width={16} height={16} />
      case 'tablet':
        return <TabletIcon width={16} height={16} />
      case 'desktop':
        return <DesktopIcon width={16} height={16} />
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 pb-4 pt-12">
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>

        <Link
          to={data.shortLinkData[0].originalUrl}
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-500 max-w-fit"
        >
          {data.shortLinkData[0].originalUrl}
          <RedirectIcon width={14} height={14} />
        </Link>
      </div>

      <div className="mb-8">
        <ChartLineLinear chartData={monthCountValues} data={data} />
      </div>

      <section className="flex gap-6">
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden flex-1">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div className=" font-semibold text-neutral-600 bg-red-100 py-1 px-4 rounded-md text-sm">
              Location
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider">
              <ClickIcon width={14} height={14} />
              <span className="font-bold">Clicks</span>
            </div>
          </div>
          <div className=" divide-gray-100 space-y-2 p-6">
            {countryStatResult.map((row: any, index: number) => (
              <div
                key={index}
                className="flex bg-neutral-100 justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors rounded-md"
              >
                <div className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                  <span className="text-sm">
                    {getCountryFlag(row.countryCode)}
                  </span>
                  {row.country}
                </div>
                <div className="text-sm text-neutral-500 font-mono">
                  {row.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden flex-1">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div className=" font-semibold text-neutral-600 bg-amber-100 py-1 px-4 rounded-md text-sm">
              Device Type
            </div>
          </div>
          <div className=" divide-gray-100 space-y-2 p-6">
            {deviceStatResult.map((row: DeviceStatsType, index: number) => (
              <div
                key={index}
                className="flex bg-neutral-100 justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors rounded-md"
              >
                <div className="text-sm font-medium text-neutral-500 capitalize flex items-center gap-2">
                  {getDeviceIcon(row.device)}
                  {row.device}
                </div>
                <div className="text-sm text-neutral-500 font-mono">
                  {row.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
