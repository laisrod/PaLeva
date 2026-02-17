import { useNavigate } from 'react-router-dom'
import { useRestaurantsList } from '../hooks/useRestaurantsList'
import '../../../../css/client/pages/RestaurantsList.css'

export default function RestaurantsList() {
  const navigate = useNavigate()
  const {
    restaurants,
    loading,
    error,
    authLoading,
    handleSelectRestaurant
  } = useRestaurantsList()

  // Não renderizar nada enquanto verifica autenticação
  if (authLoading) {
    return (
      <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>
        <p>Verificando autenticação...</p>
      </div>
    )
  }

  return (
    <div className="restaurants-container">
      <div className="restaurants-header">
        <h1 className="restaurants-title">Restaurantes</h1>
        <button
          onClick={() => navigate('/login')}
          className="back-to-login-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar ao Login
        </button>
      </div>

      {loading && <p>Carregando restaurantes...</p>}

      {error && (
        <div style={{ color: '#b91c1c', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <div className="empty-state">
          <p>Nenhum restaurante encontrado.</p>
          <p className="empty-subtitle">Aguarde enquanto novos estabelecimentos são cadastrados.</p>
        </div>
      )}

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => handleSelectRestaurant(restaurant.code)}
            className="restaurant-card"
          >
            <h2>{restaurant.name}</h2>
            {(restaurant.city || restaurant.state) && (
              <p>
                {[restaurant.city, restaurant.state].filter(Boolean).join(' - ')}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}


