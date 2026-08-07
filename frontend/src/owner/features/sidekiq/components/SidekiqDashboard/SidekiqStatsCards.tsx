import { SidekiqStats } from '../../types/sidekiq'
import '../../../../../css/owner/Dashboard.css'

interface SidekiqStatsCardsProps {
  stats: SidekiqStats
}

export default function SidekiqStatsCards({ stats }: SidekiqStatsCardsProps) {
  const cards = [
    { label: 'Processados', value: stats.processed, color: '#4caf50' },
    { label: 'Falhas',      value: stats.failed,    color: '#f44336' },
    { label: 'Na Fila',     value: stats.enqueued,  color: '#ff9800' },
    { label: 'Agendados',   value: stats.scheduled, color: '#2196f3' },
    { label: 'Tentativas',  value: stats.retries,   color: '#9c27b0' },
    { label: 'Mortos',      value: stats.dead,      color: '#607d8b' },
  ]

  return (
    <div className="stats-cards-grid">
      {cards.map(card => (
        <div className="stat-card" key={card.label}>
          <div className="stat-card-content">
            <h4 className="stat-card-label">{card.label}</h4>
            <p className="stat-card-value" style={{ color: card.color }}>
              {card.value.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
