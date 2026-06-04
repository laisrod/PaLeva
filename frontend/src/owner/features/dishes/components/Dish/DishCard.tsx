import { Link } from 'react-router-dom'
import { DishCardProps } from '../../types/dish'
import { useDishCard } from '../../hooks/Dish/useDishCard'
import '../../../../../css/owner/Dishes.css'

export default function DishCard({ dish, establishmentCode, isOwner, onDelete, deleting }: DishCardProps) {
  const {
    showPortionModal,
    setShowPortionModal,
    selectedPortionId,
    setSelectedPortionId,
    successMessage,
    portions,
    loadingPortions,
    addingItem,
    addItemError,
    handleAddToOrder,
    handleConfirmAddToOrder
  } = useDishCard({ dish, establishmentCode })

  const placeholderImage = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='60' fill='%23F5F0EA'/><text x='50%25' y='52%25' font-family='Arial' font-size='36' fill='%23A3988C' text-anchor='middle' dominant-baseline='middle'>🍽</text></svg>`

  return (
    <>
      <div className="dish-card">
        <div className="dish-card-image">
          <img
            src={dish.photo_url || placeholderImage}
            alt={dish.name}
            className="dish-card-photo"
            onError={e => { (e.target as HTMLImageElement).src = placeholderImage }}
          />
        </div>

        <div className="dish-card-content">
          <h3 className="dish-card-title">{dish.name}</h3>

          {dish.tags && dish.tags.length > 0 && (
            <div className="dish-tags">
              {dish.tags.map(tag => (
                <span key={tag.id} className="dish-tag">{tag.name}</span>
              ))}
            </div>
          )}

          <div className="dish-card-info">
            {(dish.min_price !== undefined || dish.max_price !== undefined) && (
              <div className="dish-card-price">
                {dish.min_price === dish.max_price
                  ? `R$ ${dish.min_price?.toFixed(2)}`
                  : `R$ ${dish.min_price?.toFixed(2)} - R$ ${dish.max_price?.toFixed(2)}`}
              </div>
            )}
            {dish.calories && (
              <div className="dish-card-calories">🔥 {dish.calories} kcal</div>
            )}
          </div>

          <div className="dish-card-footer">
            {successMessage && (
              <div className="dish-card-success-message">
                {successMessage}
              </div>
            )}
            <button
              className="dish-card-add-btn"
              onClick={handleAddToOrder}
              disabled={addingItem || loadingPortions}
            >
              {addingItem ? 'Adicionando...' : 'Add to Order'}
            </button>

            {isOwner && (
              <div className="dish-card-owner-actions">
                <Link
                  to={`/establishment/${establishmentCode}/dishes/${dish.id}/edit`}
                  className="dish-card-btn dish-card-btn-edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  Editar
                </Link>
                <button
                  className="dish-card-btn dish-card-btn-danger"
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (window.confirm('Tem certeza que deseja remover este prato?')) {
                      await onDelete?.(dish.id)
                    }
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Removendo...' : 'Remover'}
                </button>
                <Link
                  to={`/establishment/${establishmentCode}/dishes/${dish.id}/portions`}
                  className="dish-card-btn dish-card-btn-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  Porções
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPortionModal && (
        <div className="dish-card-modal-overlay" onClick={() => setShowPortionModal(false)}>
          <div className="dish-card-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Selecione uma Porção</h3>
            {addItemError && (
              <div className="dish-card-modal-error">
                {addItemError}
              </div>
            )}
            <div className="dish-card-modal-portions">
              {portions.map(portion => (
                <div
                  key={portion.id}
                  className={`dish-card-modal-portion ${selectedPortionId === portion.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPortionId(portion.id)}
                >
                  <div>
                    <strong>{portion.description}</strong>
                  </div>
                  <div className="dish-card-modal-price">
                    R$ {portion.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="dish-card-modal-actions">
              <button
                className="dish-card-btn dish-card-btn-secondary"
                onClick={() => {
                  setShowPortionModal(false)
                  setSelectedPortionId(null)
                }}
              >
                Cancelar
              </button>
              <button
                className="dish-card-btn dish-card-btn-primary"
                onClick={handleConfirmAddToOrder}
                disabled={!selectedPortionId || addingItem}
              >
                {addingItem ? 'Adicionando...' : 'Adicionar ao Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
