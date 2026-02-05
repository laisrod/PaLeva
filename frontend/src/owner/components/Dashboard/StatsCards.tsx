import { DashboardStats } from '../../services/api/dashboard'
import '../../../css/owner/Dashboard.css'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  return (
    <div className="stats-cards-grid">
      <div className="stat-card">
        <div className="stat-card-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <div className="stat-card-content">
          <h4 className="stat-card-label">Total de Pedidos</h4>
          <p className="stat-card-value">{stats.total_orders}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon">
          <i className="fas fa-dollar-sign"></i>
        </div>
        <div className="stat-card-content">
          <h4 className="stat-card-label">Receita Total</h4>
          <p className="stat-card-value">{formatCurrency(stats.total_revenue)}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-card-content">
          <h4 className="stat-card-label">Pedidos Entregues</h4>
          <p className="stat-card-value">{stats.orders_by_status.delivered || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="stat-card-content">
          <h4 className="stat-card-label">Em Andamento</h4>
          <p className="stat-card-value">
            {(stats.orders_by_status.pending || 0) + 
             (stats.orders_by_status.preparing || 0) + 
             (stats.orders_by_status.ready || 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
