import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useDrinks } from '../../hooks/Drink/useDrinks'
import { useDeleteDrink } from '../../hooks/Drink/useDeleteDrink'
import Layout from '../Layout/Layout'
import DrinkCard from './DrinkCard'
import '../../../css/owner/Drinks.css'

export default function Drinks() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { drinks, tags, selectedTags, loading, error, toggleTag, refetch } = useDrinks(code)
  const { deleteDrink, loading: deleting } = useDeleteDrink({ 
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

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {drinks.length > 0 ? (
          <div className="dishes-grid">
            {drinks.map(drink => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                establishmentCode={code || ''}
                isOwner={isOwner}
                onDelete={deleteDrink}
                deleting={deleting}
              />
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