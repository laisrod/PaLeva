import { MenuItemsListProps } from '../../types/menu'
import { useMenuItemsList } from '../../hooks/Menu/useMenuItemsList'
import '../../../css/owner/MenuItemsList.css'

export default function MenuItemsList({ menuItems, onSelectItem, loading }: MenuItemsListProps) {
  const {
    selectedMenuItem,
    selectedPortion,
    quantity,
    handleItemClick,
    handlePortionClick,
    handleAddToOrder,
    handleQuantityChange
  } = useMenuItemsList()

  const handleAddClick = () => {
    handleAddToOrder(onSelectItem)
  }

  if (loading) {
    return <div className="menu-items-list-loading">Carregando itens...</div>
  }

  if (menuItems.length === 0) {
    return (
      <div className="menu-items-list-empty">
        <p>Nenhum item no cardápio</p>
        <p className="menu-items-list-empty-subtitle">
          Adicione pratos ou bebidas ao cardápio primeiro.
        </p>
      </div>
    )
  }

  return (
    <div className="menu-items-list-container">
      <h3 className="menu-items-list-title">Itens do Cardápio</h3>
      
      {menuItems.map((item) => {
        const product = item.dish || item.drink
        if (!product) return null

        const isSelected = selectedMenuItem === item.id
        const portions = product.portions || []

        return (
          <div
            key={item.id}
            className={`menu-item-card ${isSelected ? 'selected' : ''}`}
          >
            <div
              onClick={() => handleItemClick(item.id)}
              className={`menu-item-header ${isSelected ? 'selected' : ''}`}
            >
              <div className="menu-item-header-content">
                <div>
                  <h4 className="menu-item-name">{product.name}</h4>
                  {product.description && (
                    <p className="menu-item-description">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className={`menu-item-arrow ${isSelected ? 'selected' : ''}`}>
                  {isSelected ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {isSelected && (
              <div className="menu-item-details">
                {portions.length === 0 ? (
                  <p className="menu-item-portion-empty">Nenhuma porção disponível</p>
                ) : (
                  <>
                    <h5 className="menu-item-portions-title">Porções:</h5>
                    <div className="menu-item-portions-list">
                      {portions.map((portion) => {
                        const isPortionSelected = selectedPortion === portion.id
                        return (
                          <div
                            key={portion.id}
                            onClick={() => handlePortionClick(portion.id)}
                            className={`menu-item-portion ${isPortionSelected ? 'selected' : ''}`}
                          >
                            <span className={`menu-item-portion-name ${isPortionSelected ? 'selected' : ''}`}>
                              {portion.description}
                            </span>
                            <span className="menu-item-portion-price">
                              R$ {portion.price.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {selectedPortion && (
                      <div className="menu-item-quantity-section">
                        <div style={{ marginBottom: '10px' }}>
                          <label className="menu-item-quantity-label">
                            Quantidade:
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="menu-item-quantity-input"
                          />
                        </div>
                        <button
                          onClick={handleAddClick}
                          className="menu-item-add-button"
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
