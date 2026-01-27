import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'
import { useRestaurants } from '../hooks/useRestaurants'
import '../../css/client/pages/RestaurantsList.css'

export default function RestaurantsList() {
  const navigate = useNavigate()
  const { user, loading: authLoading, isAuthenticated, isOwner, isClient } = useAuth()
  const { restaurants, loading, error } = useRestaurants()

  useEffect(() => {
    if (authLoading) {
      return // Aguardar verificação de autenticação
    }

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    // Verificar se é proprietário - redirecionar para gestão
    if (isOwner) {
      const establishmentCode = user.establishment?.code
      if (establishmentCode) {
        navigate(`/establishment/${establishmentCode}/menus`)
      } else {
        navigate('/establishments/new')
      }
      return
    }

    // Se não for cliente, não permitir acesso
    if (!isClient) {
      navigate('/login')
      return
    }
  }, [navigate, user, authLoading, isAuthenticated, isOwner, isClient])

  const handleSelectRestaurant = (code: string) => {
    navigate(`/menu/${code}`)
  }

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
          onClick={() => navigate('/establishments/new')}
          className="create-establishment-btn"
        >
          Criar Meu Estabelecimento
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
          <p className="empty-subtitle">Seja o primeiro a criar um estabelecimento!</p>
          <button
            onClick={() => navigate('/establishments/new')}
            className="create-establishment-btn"
          >
            Criar Meu Estabelecimento
          </button>
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


