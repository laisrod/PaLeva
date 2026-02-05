import { useParams } from 'react-router-dom'
import { useRatings } from '../hooks/Ratings/useRatings'
import StarRating from '../../shared/components/StarRating'
import Layout from '../components/Layout/Layout'
import '../../css/owner/Ratings.css'

export default function Ratings() {
  const { code } = useParams<{ code: string }>()
  const { ratings, loading, error, refetch } = useRatings(code)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Rascunho',
      pending: 'Pendente',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <Layout>
        <div className="ratings-container">
          <div className="loading-message">Carregando avaliações...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="ratings-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={refetch}>Tentar novamente</button>
          </div>
        </div>
      </Layout>
    )
  }

  if (!ratings) {
    return (
      <Layout>
        <div className="ratings-container">
          <div className="empty-message">Nenhuma avaliação encontrada.</div>
        </div>
      </Layout>
    )
  }

  const allRatings = [
    ...ratings.order_reviews.map((r) => ({ ...r, category: 'Pedidos' })),
    ...ratings.dish_ratings.map((r) => ({ ...r, category: 'Pratos' })),
    ...ratings.drink_ratings.map((r) => ({ ...r, category: 'Bebidas' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <Layout>
      <div className="ratings-container">
        <h1 className="ratings-title">Avaliações do Estabelecimento</h1>

        {/* Estatísticas */}
        <div className="ratings-statistics">
          <div className="stat-card">
            <div className="stat-value">{ratings.statistics.overall_average.toFixed(1)}</div>
            <div className="stat-label">Média Geral</div>
            <StarRating rating={ratings.statistics.overall_average} size="small" />
          </div>
          <div className="stat-card">
            <div className="stat-value">{ratings.statistics.total_order_reviews}</div>
            <div className="stat-label">Avaliações de Pedidos</div>
            <div className="stat-rating">
              <StarRating rating={ratings.statistics.average_order_rating} size="small" />
              <span className="stat-rating-value">
                {ratings.statistics.average_order_rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{ratings.statistics.total_dish_ratings}</div>
            <div className="stat-label">Avaliações de Pratos</div>
            <div className="stat-rating">
              <StarRating rating={ratings.statistics.average_dish_rating} size="small" />
              <span className="stat-rating-value">
                {ratings.statistics.average_dish_rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{ratings.statistics.total_drink_ratings}</div>
            <div className="stat-label">Avaliações de Bebidas</div>
            <div className="stat-rating">
              <StarRating rating={ratings.statistics.average_drink_rating} size="small" />
              <span className="stat-rating-value">
                {ratings.statistics.average_drink_rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Avaliações */}
        <div className="ratings-list">
          <h2 className="ratings-section-title">Todas as Avaliações</h2>
          
          {allRatings.length === 0 ? (
            <div className="empty-message">Nenhuma avaliação encontrada.</div>
          ) : (
            <div className="ratings-grid">
              {allRatings.map((rating) => (
                <div key={`${rating.type}-${rating.id}`} className="rating-card">
                  <div className="rating-header">
                    <div className="rating-category">{rating.category}</div>
                    <div className="rating-date">{formatDate(rating.created_at)}</div>
                  </div>
                  
                  <div className="rating-stars">
                    <StarRating rating={rating.rating} size="medium" />
                  </div>

                  {rating.comment && (
                    <div className="rating-comment">
                      <p>{rating.comment}</p>
                    </div>
                  )}

                  <div className="rating-user">
                    <strong>Cliente:</strong> {rating.user.name} ({rating.user.email})
                  </div>

                  {'order' in rating && (
                    <div className="rating-order-info">
                      <strong>Pedido:</strong> #{rating.order.code} - {formatCurrency(rating.order.total_price)}
                      <span className={`order-status status-${rating.order.status}`}>
                        {getStatusLabel(rating.order.status)}
                      </span>
                    </div>
                  )}

                  {'item' in rating && (
                    <div className="rating-item-info">
                      <strong>{rating.item.type === 'dish' ? 'Prato' : 'Bebida'}:</strong> {rating.item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
