import { useState } from 'react'
import { useDashboardStats, Period } from '../../hooks/Dashboard/useDashboardStats'
import StatsCards from './StatsCards'
import OrdersByStatusChart from './OrdersByStatusChart'
import SalesChart from './SalesChart'
import TopItemsList from './TopItemsList'
import '../../../css/owner/Dashboard.css'

interface DashboardStatsProps {
  establishmentCode: string
}

export default function DashboardStats({ establishmentCode }: DashboardStatsProps) {
  const [period, setPeriod] = useState<Period>('day')
  const { stats, loading, error } = useDashboardStats(establishmentCode, period)

  if (loading) {
    return (
      <div className="dashboard-stats-container">
        <div className="stats-loading">Carregando estatísticas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-stats-container">
        <div className="stats-error">Erro ao carregar estatísticas: {error}</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="dashboard-stats-container">
        <div className="stats-empty">Nenhuma estatística disponível</div>
      </div>
    )
  }

  return (
    <div className="dashboard-stats-container">
      {/* Seletor de Período */}
      <div className="stats-period-selector">
        <h2 className="stats-section-title">Estatísticas</h2>
        <div className="period-buttons">
          <button
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            Hoje
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Este Mês
          </button>
          <button
            className={`period-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => setPeriod('year')}
          >
            Este Ano
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <StatsCards stats={stats} />

      {/* Gráficos e Listas */}
      <div className="stats-charts-grid">
        {/* Gráfico de Vendas */}
        <div className="stats-chart-card">
          <h3 className="chart-title">Vendas</h3>
          <SalesChart data={stats.sales_chart_data} period={period} />
        </div>

        {/* Pedidos por Status */}
        <div className="stats-chart-card">
          <h3 className="chart-title">Pedidos por Status</h3>
          <OrdersByStatusChart data={stats.orders_by_status} />
        </div>
      </div>

      {/* Top Itens Mais Vendidos */}
      <div className="stats-chart-card full-width">
        <h3 className="chart-title">Itens Mais Vendidos</h3>
        <TopItemsList items={stats.top_items} />
      </div>
    </div>
  )
}
