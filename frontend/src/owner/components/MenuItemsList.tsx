import { useState } from 'react'
import { MenuItemWithPortions } from '../types/menu'

interface MenuItemsListProps {
  menuItems: MenuItemWithPortions[]
  onSelectItem: (menuItemId: number, portionId: number, quantity: number) => void
  loading?: boolean
}

export default function MenuItemsList({ menuItems, onSelectItem, loading }: MenuItemsListProps) {
  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null)
  const [selectedPortion, setSelectedPortion] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleItemClick = (menuItemId: number) => {
    if (selectedMenuItem === menuItemId) {
      setSelectedMenuItem(null)
      setSelectedPortion(null)
    } else {
      setSelectedMenuItem(menuItemId)
      setSelectedPortion(null)
    }
  }

  const handlePortionClick = (portionId: number) => {
    setSelectedPortion(portionId)
  }

  const handleAddToOrder = () => {
    if (selectedMenuItem && selectedPortion) {
      onSelectItem(selectedMenuItem, selectedPortion, quantity)
      setSelectedMenuItem(null)
      setSelectedPortion(null)
      setQuantity(1)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando itens...</div>
  }

  if (menuItems.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>Nenhum item no cardápio</p>
        <p style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
          Adicione pratos ou bebidas ao cardápio primeiro.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Itens do Cardápio</h3>
      
      {menuItems.map((item) => {
        const product = item.dish || item.drink
        if (!product) return null

        const isSelected = selectedMenuItem === item.id
        const portions = product.portions || []

        return (
          <div
            key={item.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginBottom: '15px',
              overflow: 'hidden',
              backgroundColor: isSelected ? '#f0f8ff' : '#fff'
            }}
          >
            <div
              onClick={() => handleItemClick(item.id)}
              style={{
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                borderBottom: isSelected ? '2px solid #2196f3' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#333' }}>{product.name}</h4>
                  {product.description && (
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                      {product.description}
                    </p>
                  )}
                </div>
                <div style={{ fontSize: '20px', color: isSelected ? '#2196f3' : '#999' }}>
                  {isSelected ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {isSelected && (
              <div style={{ padding: '15px', backgroundColor: '#fafafa' }}>
                {portions.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhuma porção disponível</p>
                ) : (
                  <>
                    <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>Porções:</h5>
                    <div style={{ marginBottom: '15px' }}>
                      {portions.map((portion) => {
                        const isPortionSelected = selectedPortion === portion.id
                        return (
                          <div
                            key={portion.id}
                            onClick={() => handlePortionClick(portion.id)}
                            style={{
                              padding: '10px',
                              marginBottom: '8px',
                              border: `2px solid ${isPortionSelected ? '#2196f3' : '#ddd'}`,
                              borderRadius: '5px',
                              cursor: 'pointer',
                              backgroundColor: isPortionSelected ? '#e3f2fd' : '#fff',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span style={{ fontWeight: isPortionSelected ? 'bold' : 'normal' }}>
                              {portion.description}
                            </span>
                            <span style={{ color: '#2196f3', fontWeight: 'bold' }}>
                              R$ {portion.price.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {selectedPortion && (
                      <div style={{
                        padding: '15px',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }}>
                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Quantidade:
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{
                              width: '100px',
                              padding: '8px',
                              borderRadius: '5px',
                              border: '1px solid #ddd',
                              fontSize: '16px'
                            }}
                          />
                        </div>
                        <button
                          onClick={handleAddToOrder}
                          style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Adicionar ao Pedido
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
