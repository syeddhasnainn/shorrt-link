'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { ClickCount } from '@/components/click-count'

export const description = 'A linear line chart'

const chartConfig = {
  desktop: {
    label: 'Clicks',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartLineLinear({
  chartData,
  data,
}: {
  chartData: any
  data: any
}) {
  return (
    <Card className="!shadow-none">
      <CardHeader className="!py-0 ">
        {/* <CardTitle>Line Chart - Linear</CardTitle> */}
        <ClickCount data={data} />
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthDay"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              padding={{ left: 20, right: 20 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
