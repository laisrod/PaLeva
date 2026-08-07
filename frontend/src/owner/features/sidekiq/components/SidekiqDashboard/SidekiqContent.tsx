import { useSidekiqStats } from '../../hooks/useSidekiqStats'
import SidekiqStatsCards from './SidekiqStatsCards'
import SidekiqQueuesList from './SidekiqQueuesList'
import '../../../../../css/owner/Dashboard.css'

export default function SidekiqContent() {
  const { stats, loading, error, refresh } = useSidekiqStats(5000)

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Jobs em Background</h1>
        <h2 className="dashboard-subtitle">
          Monitoramento do Sidekiq — atualiza a cada 5s
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '12px', alignItems: 'center' }}>
        {loading && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Atualizando...</span>}
        <button onClick={refresh} className="dashboard-btn btn-outline-owner" style={{ padding: '6px 16px' }}>
          ↻ Atualizar
        </button>
        <a
          href="http://localhost:3000/sidekiq"
          target="_blank"
          rel="noreferrer"
          className="dashboard-btn btn-outline-owner"
          style={{ padding: '6px 16px' }}
        >
          ↗ Painel Completo
        </a>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <SidekiqStatsCards stats={stats} />

      <div style={{ marginTop: '24px' }}>
        <SidekiqQueuesList queues={stats.queues} />
      </div>
    </div>
  )
}
