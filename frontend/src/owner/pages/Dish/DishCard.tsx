import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dish } from '../../types/dish'
import { useCurrentOrder } from '../../hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../hooks/Orders/useAddOrderItem'
import { useDishPortions } from '../../hooks/DishPortion/useDishPortions'

interface DishCardProps {
  dish: Dish
  establishmentCode: string
  isOwner: boolean
  onDelete?: (dishId: number) => Promise<boolean | void>
  deleting?: boolean
}

export default function DishCard({ dish, establishmentCode, isOwner, onDelete, deleting }: DishCardProps) {
  const [showPortionModal, setShowPortionModal] = useState(false)
  const [selectedPortionId, setSelectedPortionId] = useState<number | null>(null)

  const { 
    currentOrder, 
    createNewOrder, 
    loadOrder 
  } = useCurrentOrder({
    establishmentCode,
    autoCreate: false
  })

  const { portions, loading: loadingPortions } = useDishPortions(establishmentCode, dish.id)

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      if (currentOrder) {
        loadOrder(currentOrder.code)
      }
      setShowPortionModal(false)
      setSelectedPortionId(null)
    }
  })

  const handleAddToOrder = async () => {
    // Se não houver pedido atual, criar um novo
    let orderToUse = currentOrder
    if (!orderToUse) {
      const newOrder = await createNewOrder()
      if (!newOrder) {
        alert('Erro ao criar pedido. Tente novamente.')
        return
      }
      // Aguardar um pouco para o hook atualizar
      await new Promise(resolve => setTimeout(resolve, 500))
      // Tentar novamente após criar o pedido
      return
    }

    // Se ainda não temos porções carregadas, aguardar
    if (portions.length === 0 && loadingPortions) {
      return
    }

    // Se não houver porções, mostrar mensagem
    if (portions.length === 0) {
      alert('Este prato não possui porções cadastradas. Por favor, adicione porções primeiro.')
      return
    }

    // Se houver apenas uma porção, adicionar diretamente
    if (portions.length === 1) {
      await addItem({ 
        dishId: dish.id, 
        portionId: portions[0].id, 
        quantity: 1 
      })
      return
    }

    // Se houver múltiplas porções, mostrar modal
    if (portions.length > 1) {
      setShowPortionModal(true)
      return
    }
  }

  const handleConfirmAddToOrder = async () => {
    if (!selectedPortionId) {
      alert('Por favor, selecione uma porção')
      return
    }

    await addItem({ 
      dishId: dish.id, 
      portionId: selectedPortionId, 
      quantity: 1 
    })
  }

  return (
    <>
      <div className="dish-card">
        {dish.photo_url && (
          <div className="dish-card-image">
            <img 
              src={dish.photo_url} 
              alt={dish.name}
              className="dish-card-photo"
            />
          </div>
        )}
        
        <div className="dish-card-content">
          <h3 className="dish-card-title">{dish.name}</h3>
          
          {dish.description && (
            <p className="dish-card-description">{dish.description}</p>
          )}

          <div className="dish-card-info">
            {(dish.min_price !== undefined || dish.max_price !== undefined) && (
              <div className="dish-card-price">
                {dish.min_price === dish.max_price ? (
                  <strong>R$ {dish.min_price?.toFixed(2)}</strong>
                ) : (
                  <strong>R$ {dish.min_price?.toFixed(2)} - R$ {dish.max_price?.toFixed(2)}</strong>
                )}
              </div>
            )}
            
            {dish.calories && (
              <div className="dish-card-calories">
                <strong>Calorias:</strong> {dish.calories} kcal
              </div>
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
          </div>

          <div className="dish-card-footer">
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
