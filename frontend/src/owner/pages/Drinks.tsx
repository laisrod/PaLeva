import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../shared/hooks/useRequireAuth'
import { useDrinks } from '../hooks/useDrinks'
import Layout from '../components/Layout'
import '../../css/owner/pages/Drinks.css'

export default function Drinks() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { drinks, loading, error } = useDrinks(code)

  const isOwner = true // TODO: Verificar se o usuário é dono

  if (loading) {
    return (
      <Layout>
        <div className="container mt-4">
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="drinks-container">
        <div className="drinks-header">
          <h1 className="drinks-title">Bebidas</h1>
          <div className="drinks-actions">
            {isOwner && (
              <Link
                to={`/establishment/${code}/drinks/new`}
                className="drinks-btn drinks-btn-primary"
              >
                ➕ Nova Bebida
              </Link>
            )}
            <Link
              to={`/establishment/${code}`}
              className="drinks-btn drinks-btn-secondary"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {drinks.length > 0 ? (
          <div className="drinks-grid">
            {drinks.map(drink => (
              <div key={drink.id} className="drink-card">
                <h3 className="drink-card-title">
                  <Link to={`/establishment/${code}/drinks/${drink.id}`}>
                    {drink.name}
                  </Link>
                </h3>
                {drink.description && (
                  <p className="drink-card-description">{drink.description}</p>
                )}
                <div className="drink-card-actions">
                  {isOwner && (
                    <>
                      <Link
                        to={`/establishment/${code}/drinks/${drink.id}/edit`}
                        className="drink-card-btn drink-card-btn-primary"
                      >
                        Editar
                      </Link>
                      <button
                        className="drink-card-btn drink-card-btn-danger"
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja remover esta bebida?')) {
                            // TODO: Implementar remoção
                          }
                        }}
                      >
                        Remover
                      </button>
                    </>
                  )}
                  <Link
                    to={`/establishment/${code}/drinks/${drink.id}/portions/new`}
                    className="drink-card-btn drink-card-btn-secondary"
                  >
                    Porções
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma bebida cadastrada</p>
            {isOwner && (
              <Link
                to={`/establishment/${code}/drinks/new`}
                className="drinks-btn drinks-btn-primary mt-3"
              >
                ➕ Criar Primeira Bebida
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}