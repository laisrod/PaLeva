import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import '../../../css/owner/Dashboard.css'

interface OrdersByStatusChartProps {
  data: Record<string, number>
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#9E9E9E',
  pending: '#FF9800',
  preparing: '#2196F3',
  ready: '#4CAF50',
  delivered: '#8BC34A',
  cancelled: '#F44336'
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  preparing: 'Preparando',
  ready: 'Pronto',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
}

export default function OrdersByStatusChart({ data }: OrdersByStatusChartProps) {
  const chartData = Object.entries(data).map(([status, value]) => ({
    name: STATUS_LABELS[status] || status,
    value,
    color: STATUS_COLORS[status] || '#9E9E9E'
  }))

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum pedido no período selecionado</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
