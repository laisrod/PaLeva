import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useTags } from '../../hooks/useTags'
import { useTagsActions } from '../../hooks/Tags/useTagsActions'
import { Tag, TagCategory } from '../../../tags/types/tag'
import Layout from '../../../../shared/components/Layout/Layout'
import '../../../../../css/owner/Tags.css'

export default function Tags() {
  const { code } = useParams<{ code: string }>()
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category') as TagCategory | null
  useRequireOwner() // Verifica se é owner e redireciona se não for

  const { isOwner } = useAuth()
  
  // Tags de pratos
  const {
    tags: dishTags,
    loading: loadingDish,
    error: errorDish,
    deleteTag: deleteDishTag,
    refetch: refetchDish
  } = useTags({ establishmentCode: code, category: 'dish' })
  const { handleDeleteTag: handleDeleteDishTag } = useTagsActions({
    deleteTag: deleteDishTag,
    refetch: refetchDish
  })

  // Tags de bebidas
  const {
    tags: drinkTags,
    loading: loadingDrink,
    error: errorDrink,
    deleteTag: deleteDrinkTag,
    refetch: refetchDrink
  } = useTags({ establishmentCode: code, category: 'drink' })
  const { handleDeleteTag: handleDeleteDrinkTag } = useTagsActions({
    deleteTag: deleteDrinkTag,
    refetch: refetchDrink
  })

  const showDishes = !categoryFilter || categoryFilter === 'dish'
  const showDrinks = !categoryFilter || categoryFilter === 'drink'
  
  const loading = (showDishes && loadingDish) || (showDrinks && loadingDrink)
  const error = errorDish || errorDrink

  // Determinar para onde voltar
  const backUrl = categoryFilter === 'drink'
    ? `/establishment/${code}/drinks`
    : `/establishment/${code}/dishes`

  // Título baseado no filtro
  const title = categoryFilter === 'dish'
    ? 'Características de Pratos'
    : categoryFilter === 'drink'
    ? 'Características de Bebidas'
    : 'Características'

  if (loading) {
    return (
      <Layout>
        <div className="tags-container">
          <div className="tags-header">
            <h1 className="tags-title">{title}</h1>
          </div>
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  const renderTagCard = (
    tag: Tag,
    onDelete: (id: number) => Promise<boolean>
  ) => (
    <div key={tag.id} className="tag-card">
      <h3 className="tag-card-title">{tag.name}</h3>
      <div className="tag-card-separator" aria-hidden />
      <div className="tag-card-actions">
        {isOwner && (
          <>
            <Link
              to={`/establishment/${code}/tags/${tag.id}/edit`}
              className="tag-card-btn"
            >
              Editar
            </Link>
            <button
              type="button"
              className="tag-card-btn"
              onClick={() => onDelete(tag.id)}
            >
              Remover
            </button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="tags-container">
        <div className="tags-header">
          <h1 className="tags-title">{title}</h1>
          <div className="tags-actions">
            {categoryFilter && (
              <Link
                to={`/establishment/${code}/tags`}
                className="tags-btn tags-btn-secondary"
              >
                Ver Todas
              </Link>
            )}
            <Link
              to={backUrl}
              className="tags-btn tags-btn-secondary"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {error && (
          <div className="tags-error">
            <p>{error}</p>
          </div>
        )}

        {/* Seção de Tags de Pratos */}
        {showDishes && (
          <div className="tags-section">
            <div className="tags-section-header">
              <h2 className="tags-section-title">Características de Pratos</h2>
              {isOwner && (
                <Link
                  to={`/establishment/${code}/tags/new?category=dish`}
                  className="tags-btn tags-btn-primary"
                >
                  Nova
                </Link>
              )}
            </div>
            {dishTags.length > 0 ? (
              <div className="tags-grid">
                {dishTags.map((tag) => renderTagCard(tag, handleDeleteDishTag))}
              </div>
            ) : (
              <div className="tags-empty-section">
                <p>Nenhuma característica de prato cadastrada</p>
              </div>
            )}
          </div>
        )}

        {/* Seção de Tags de Bebidas */}
        {showDrinks && (
          <div className="tags-section">
            <div className="tags-section-header">
              <h2 className="tags-section-title">Características de Bebidas</h2>
              {isOwner && (
                <Link
                  to={`/establishment/${code}/tags/new?category=drink`}
                  className="tags-btn tags-btn-primary"
                >
                  Nova
                </Link>
              )}
            </div>
            {drinkTags.length > 0 ? (
              <div className="tags-grid">
                {drinkTags.map((tag) => renderTagCard(tag, handleDeleteDrinkTag))}
              </div>
            ) : (
              <div className="tags-empty-section">
                <p>Nenhuma característica de bebida cadastrada</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
