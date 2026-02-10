import { useState, useEffect, useRef } from 'react'
import ClientLayout from '../../../shared/layouts/ClientLayout'
import { useOrderHistoryPage } from '../hooks/useOrderHistoryPage'
import { ORDER_STATUSES } from '../types/orderHistory'
import { formatCurrency, formatDate, getStatusLabel, getStatusClass } from '../utils/orderUtils'
import '../../../../css/client/OrderHistory.css'

export default function OrderHistory() {
  const {
    orders,
    pagination,
    loading,
    error,
    isOwner,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    handleFilterChange,
    handlePageChange,
    refetch,
    loadMore,
    hasMore,
  } = useOrderHistoryPage()

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const content = (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>{isOwner ? 'Histórico de Pedidos do Estabelecimento' : 'Histórico de Pedidos'}</h1>
      </div>

      {/* Filtros */}
      <div className="order-history-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="filter-select"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="start-date">Data Inicial:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="end-date">Data Final:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-input"
          />
        </div>

        <button onClick={handleFilterChange} className="filter-button">
          Filtrar
        </button>
      </div>

      {/* Lista de Pedidos */}
      {loading && <div className="loading-message">Carregando pedidos...</div>}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refetch}>Tentar novamente</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-message">
          <p>Nenhum pedido encontrado.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.code}</h3>
                    <p className="establishment-name">{order.establishment.name}</p>
                    {order.customer && (
                      <p className="customer-info">
                        Cliente: {order.customer.name || order.customer.email || 'N/A'}
                      </p>
                    )}
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: {formatCurrency(order.total_price)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel para infinite scroll */}
          {hasMore && <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />}
        </>
      )}
    </div>
  )

  const [OwnerLayout, setOwnerLayout] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null)

  useEffect(() => {
    if (isOwner) {
      import('../../../../owner/shared/components/Layout/Layout').then((module) => {
        setOwnerLayout(() => module.default)
      })
    }
  }, [isOwner])

  useEffect(() => {
    if (!hasMore || loading) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '100px', threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  // Se for owner, usa o Layout do owner, senão usa o ClientLayout
  if (isOwner && OwnerLayout) {
    return <OwnerLayout>{content}</OwnerLayout>
  }

  return <ClientLayout>{content}</ClientLayout>
}
