import { Link } from 'react-router-dom'
import { DrinkCardProps } from '../../types/drink'
import { useDrinkCard } from '../../hooks/Drink/useDrinkCard'
import '../../../css/owner/Drinks.css'

export default function DrinkCard({ drink, establishmentCode, isOwner, onDelete, deleting }: DrinkCardProps) {
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
  } = useDrinkCard({ drink, establishmentCode })

  return (
    <>
      <div className="dish-card">
        {drink.photo_url && (
          <div className="dish-card-image">
            <img 
              src={drink.photo_url} 
              alt={drink.name}
              className="dish-card-photo"
            />
          </div>
        )}
        
        <div className="dish-card-content">
          <h3 className="dish-card-title">{drink.name}</h3>
          
          {drink.description && (
            <p className="dish-card-description">{drink.description}</p>
          )}

          <div className="dish-card-info">
            {(drink.min_price !== undefined || drink.max_price !== undefined) && (
              <div className="dish-card-price">
                {drink.min_price === drink.max_price ? (
                  <strong>R$ {drink.min_price?.toFixed(2)}</strong>
                ) : (
                  <strong>R$ {drink.min_price?.toFixed(2)} - R$ {drink.max_price?.toFixed(2)}</strong>
                )}
              </div>
            )}
            
            {drink.calories && (
              <div className="dish-card-calories">
                <strong>Calorias:</strong> {drink.calories} kcal
              </div>
            )}
            
            {drink.alcoholic !== undefined && (
              <div className="dish-card-calories">
                <strong>Alcoólico:</strong> {drink.alcoholic ? 'Sim' : 'Não'}
              </div>
            )}
            
            {drink.tags && drink.tags.length > 0 && (
              <div className="dish-tags">
                {drink.tags.map(tag => (
                  <span key={tag.id} className="dish-tag">
                    {tag.name}
                  </span>
                ))}
              </div>
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
                  to={`/establishment/${establishmentCode}/drinks/${drink.id}/edit`}
                  className="dish-card-btn dish-card-btn-edit"
                  onClick={(e) => e.stopPropagation()}
                >
                  Editar
                </Link>
                <button
                  className="dish-card-btn dish-card-btn-danger"
                  onClick={async (e) => {
                    e.stopPropagation()
                    if (window.confirm('Tem certeza que deseja remover esta bebida?')) {
                      await onDelete?.(drink.id)
                    }
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Removendo...' : 'Remover'}
                </button>
                <Link
                  to={`/establishment/${establishmentCode}/drinks/${drink.id}/portions`}
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
