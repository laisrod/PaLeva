import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Period } from '../../hooks/Dashboard/useDashboardStats'
import '../../../../../css/owner/Dashboard.css'

interface SalesChartProps {
  data: Array<{
    date: string
    label: string
    revenue: number
  }>
  period: Period
}

export default function SalesChart({ data, period }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: '#333' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4CAF50" 
            strokeWidth={2}
            dot={{ fill: '#4CAF50', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
