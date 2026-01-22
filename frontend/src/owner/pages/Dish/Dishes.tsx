import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useDishes } from '../../hooks/Dish/useDishes'
import { useDeleteDish } from '../../hooks/Dish/useDeleteDish'
import Layout from '../../components/Layout'
import '../../../css/owner/pages/Dishes.css'

export default function Dishes() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { dishes, tags, selectedTags, loading, error, toggleTag, refetch } = useDishes(code)
  const { deleteDish, loading: deleting } = useDeleteDish({ 
    establishmentCode: code,
    onSuccess: () => {
      refetch()
    }
  })

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
      <div className="dishes-container">
        <div className="dishes-header">
          <h1 className="dishes-title">Pratos</h1>
          <div className="dishes-actions">
            {isOwner && (
              <>
                <Link
                  to={`/establishment/${code}/tags/new`}
                  className="dishes-btn dishes-btn-outline"
                >
                  ➕ Característica
                </Link>
                <Link
                  to={`/establishment/${code}/dishes/new`}
                  className="dishes-btn dishes-btn-primary"
                >
                  ➕ Novo Prato
                </Link>
              </>
            )}
            <Link
              to={`/establishment/${code}`}
              className="dishes-btn dishes-btn-secondary"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="filters-card">
            <h3 className="filters-title">Filtrar por Características</h3>
            <form onSubmit={handleFilter} className="filters-form">
                  <div className="filter-tags">
                {tags.map(tag => (
                  <div key={tag.id} className="filter-tag">
                    <input
                      type="checkbox"
                      id={`tag_${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <label htmlFor={`tag_${tag.id}`}>
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
              <button type="submit" className="dishes-btn dishes-btn-primary">
                Filtrar
              </button>
            </form>
          </div>
        )}

        {dishes.length > 0 ? (
          <div className="dishes-grid">
            {dishes.map(dish => (
              <div key={dish.id} className="dish-card">
                <h3 className="dish-card-title">
                  <Link to={`/establishment/${code}/dishes/${dish.id}`}>
                    {dish.name}
                  </Link>
                </h3>
                {dish.description && (
                  <p className="dish-card-description">{dish.description}</p>
                )}
                {dish.tags && dish.tags.length > 0 && (
                  <div className="dish-tags">
                    {dish.tags.map(tag => (
                      <span key={tag.id} className="dish-tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="dish-card-actions">
                  {isOwner && (
                    <>
                      <Link
                        to={`/establishment/${code}/dishes/${dish.id}/edit`}
                        className="dish-card-btn dish-card-btn-primary"
                      >
                        Editar
                      </Link>
                      <button
                        className="dish-card-btn dish-card-btn-danger"
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja remover este prato?')) {
                            await deleteDish(dish.id)
                          }
                        }}
                        disabled={deleting}
                      >
                        {deleting ? 'Removendo...' : 'Remover'}
                      </button>
                    </>
                  )}
                  <Link
                    to={`/establishment/${code}/dishes/${dish.id}/portions/new`}
                    className="dish-card-btn dish-card-btn-secondary"
                  >
                    Porções
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhum prato cadastrado</p>
            {isOwner && (
              <Link
                to={`/establishment/${code}/dishes/new`}
                className="dishes-btn dishes-btn-primary mt-3"
              >
                ➕ Criar Primeiro Prato
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

