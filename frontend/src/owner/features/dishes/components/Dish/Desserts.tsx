import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import DishesFilters from './DishesFilters'
import DishesList from './DishesList'
import DishesLoading from './DishesLoading'
import OrderSidebar from '../../../orders/components/Orders/OrderSidebar'
import { useDessertsPage } from '../../hooks/Dish/useDessertsPage'
import { useInfiniteScroll } from '../../../../../shared/hooks/useInfiniteScroll'
import { Dish } from '../../types/dish'
import '../../../../../css/owner/Dishes.css'

export default function Desserts() {
  const {
    establishmentCode,
    isOwner,
    dishes,
    tags,
    selectedTags,
    loading,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDish,
    deleting,
    hasDessertTags,
  } = useDessertsPage()

  const { displayedItems, sentinelRef } = useInfiniteScroll<Dish>(dishes, 12)

  if (loading) {
    return <DishesLoading />
  }

  return (
    <Layout>
      <div className="dishes-container">
        <div className="dishes-header">
          <div className="dishes-header-top">
            <div>
              <h1 className="dishes-title">🍰 Sobremesas</h1>
              {!hasDessertTags && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
                  Crie tags com nomes como "Sobremesa" ou "Doce" para filtrar automaticamente aqui.
                </p>
              )}
            </div>
            {isOwner && (
              <div className="dishes-actions">
                <Link
                  to={`/establishment/${establishmentCode}/desserts/new`}
                  className="dishes-btn dishes-btn-primary"
                >
                  + Nova Sobremesa
                </Link>
              </div>
            )}
          </div>
        </div>

        <DishesFilters
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {dishes.length > 0 ? (
          <>
            <DishesList
              dishes={displayedItems}
              establishmentCode={establishmentCode}
              isOwner={isOwner}
              onDelete={deleteDish}
              deleting={deleting}
            />
            <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
          </>
        ) : (
          <div className="empty-state" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🍰</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
              Nenhuma sobremesa encontrada.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)' }}>
              Adicione a tag "Sobremesa" a um prato para que apareça aqui.
            </p>
          </div>
        )}
      </div>

      <OrderSidebar establishmentCode={establishmentCode} />
    </Layout>
  )
}
