import { useRequireAuth } from '../../shared/hooks/useRequireAuth'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../../shared/hooks/useAuth'
import Layout from '../components/Layout'
import '../../css/owner/pages/Orders.css'

export default function Orders() {
  useRequireAuth()
  const { user } = useAuth()
  const establishmentCode = user?.establishment?.code || localStorage.getItem('establishment_code') || undefined
  
  const { orders, loading, error, changeStatus } = useOrders(establishmentCode)


  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      draft: { label: 'Rascunho', color: '#9ca3af' },
      pending: { label: 'Pendente', color: '#3b82f6' },
      preparing: { label: 'Preparando', color: '#f59e0b' },
      ready: { label: 'Pronto', color: '#10b981' },
      delivered: { label: 'Entregue', color: '#8b5cf6' },
      cancelled: { label: 'Cancelado', color: '#ef4444' },
    }
    return badges[status] || { label: status, color: '#6b7280' }
  }

  if (loading && (!orders || orders.length === 0)) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="loading">Carregando pedidos...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">Pedidos</h1>
        </div>

        <div className="orders-card">
          <div className="orders-card-header">
            <h2>Lista de Pedidos</h2>
          </div>

          {error && (
            <div className="orders-alert orders-alert-danger">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="orders-alert orders-alert-info">
              Nenhum pedido encontrado
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Valor Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="order-code">#{order.code}</div>
                          {order.customer_name && (
                            <div className="order-customer">{order.customer_name}</div>
                          )}
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: statusBadge.color }}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td>{new Date(order.created_at).toLocaleString('pt-BR')}</td>
                        <td>R$ {order.total_price?.toFixed(2) || '0.00'}</td>
                        <td>
                          <div className="order-actions">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => changeStatus(order.code, 'prepare')}
                                className="order-action-btn order-action-btn-warning"
                              >
                                Iniciar Preparo
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => changeStatus(order.code, 'ready')}
                                className="order-action-btn order-action-btn-success"
                              >
                                Marcar como Pronto
                              </button>
                            )}
                            {!['delivered', 'cancelled'].includes(order.status) && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Motivo do cancelamento:')
                                  if (reason) {
                                    changeStatus(order.code, 'cancel')
                                  }
                                }}
                                className="order-action-btn order-action-btn-danger"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

