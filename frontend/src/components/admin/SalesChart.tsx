import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatPrice } from '@/lib/utils';
import type { IAdminStats } from '@/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  total: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

export function SalesChart({ data }: { data: IAdminStats['salesByDay'] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className='aspect-auto h-64 w-full'>
      <BarChart
        data={data}
        margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: string) => shortDate.format(new Date(value))}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(value: number) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
        />
        <ChartTooltip
          cursor={{ fill: 'var(--muted)', opacity: 0.6 }}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => shortDate.format(new Date(String(value)))}
              formatter={(value) => formatPrice(Number(value))}
              indicator='line'
            />
          }
        />
        <Bar
          dataKey='total'
          fill='var(--color-total)'
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ChartContainer>
  );
}
