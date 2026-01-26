import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useDishes } from '../../hooks/Dish/useDishes'
import { useDeleteDish } from '../../hooks/Dish/useDeleteDish'
import Layout from '../Layout/Layout'
import DishCard from './DishCard'
import '../../../css/owner/Dishes.css'

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
              <Link
                to={`/establishment/${code}/dishes/new`}
                className="dishes-btn dishes-btn-primary"
              >
                ➕ Novo Prato
              </Link>
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
          </div>
        )}

        {dishes.length > 0 ? (
          <div className="dishes-grid">
            {dishes.map(dish => (
              <DishCard
                key={dish.id}
                dish={dish}
                establishmentCode={code || ''}
                isOwner={isOwner}
                onDelete={deleteDish}
                deleting={deleting}
              />
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

