import { SidekiqQueue } from '../../types/sidekiq'
import '../../../../../css/owner/Dashboard.css'

interface SidekiqQueuesListProps {
  queues: SidekiqQueue[]
}

export default function SidekiqQueuesList({ queues }: SidekiqQueuesListProps) {
  if (queues.length === 0) {
    return (
      <div className="dashboard-card">
        <h3 className="card-title">Filas</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma fila encontrada.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-card">
      <h3 className="card-title">Filas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-gray-200)' }}>
            <th style={thStyle}>Fila</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Jobs pendentes</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Latência (s)</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {queues.map(queue => (
            <tr key={queue.name} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
              <td style={tdStyle}>
                <code style={{ background: 'var(--color-gray-100)', padding: '2px 6px', borderRadius: '4px' }}>
                  {queue.name}
                </code>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>
                {queue.size}
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                {queue.latency}s
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: queue.size === 0 ? '#e8f5e9' : '#fff3e0',
                  color: queue.size === 0 ? '#2e7d32' : '#e65100',
                }}>
                  {queue.size === 0 ? 'Ociosa' : 'Ativa'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const tdStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
}
