import { AddMenuItemsProps } from '../../types/menu'
import { useAddMenuItems } from '../../hooks/Menu/useAddMenuItems'
import '../../../../../css/owner/AddMenuItems.css'

export default function AddMenuItems(props: AddMenuItemsProps) {
  const {
    dishes,
    drinks,
    loading,
    activeTab,
    setActiveTab,
    adding,
    error,
    handleAddItem,
    isItemInMenu,
    showPortionModal,
    setShowPortionModal,
    selectedItem,
    portions,
    loadingPortions,
    selectedPortions,
    handlePortionToggle,
    handleConfirmAdd,
  } = useAddMenuItems(props)

  if (loading) {
    return <div className="add-menu-items-loading">Carregando itens...</div>
  }

  return (
    <div className="add-menu-items-container">
      <h3 className="add-menu-items-title">Adicionar Itens ao Cardápio</h3>

      {error && (
        <div className="add-menu-items-error">
          {error}
        </div>
      )}

      <div className="add-menu-items-tabs">
        <button
          className={`add-menu-items-tab ${activeTab === 'dishes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dishes')}
        >
          Pratos
        </button>
        <button
          className={`add-menu-items-tab ${activeTab === 'drinks' ? 'active' : ''}`}
          onClick={() => setActiveTab('drinks')}
        >
          Bebidas
        </button>
      </div>

      <div className="add-menu-items-list">
        {activeTab === 'dishes' ? (
          dishes.length === 0 ? (
            <p className="add-menu-items-empty">Nenhum prato cadastrado</p>
          ) : (
            dishes.map(dish => {
              const isInMenu = isItemInMenu(dish.id, true)
              const isAdding = adding === dish.id

              return (
                <div key={dish.id} className="add-menu-item-card">
                  <div className="add-menu-item-info">
                    <h4 className="add-menu-item-name">{dish.name}</h4>
                    {dish.description && (
                      <p className="add-menu-item-description">{dish.description}</p>
                    )}
                  </div>
                  <button
                    className={`add-menu-item-btn ${isInMenu ? 'in-menu' : ''}`}
                    onClick={() => !isInMenu && handleAddItem(dish.id, undefined)}
                    disabled={isInMenu || isAdding}
                  >
                    {isAdding ? 'Adicionando...' : isInMenu ? 'Já no cardápio' : 'Adicionar'}
                  </button>
                </div>
              )
            })
          )
        ) : (
          drinks.length === 0 ? (
            <p className="add-menu-items-empty">Nenhuma bebida cadastrada</p>
          ) : (
            drinks.map(drink => {
              const isInMenu = isItemInMenu(drink.id, false)
              const isAdding = adding === drink.id

              return (
                <div key={drink.id} className="add-menu-item-card">
                  <div className="add-menu-item-info">
                    <h4 className="add-menu-item-name">{drink.name}</h4>
                    {drink.description && (
                      <p className="add-menu-item-description">{drink.description}</p>
                    )}
                  </div>
                  <button
                    className={`add-menu-item-btn ${isInMenu ? 'in-menu' : ''}`}
                    onClick={() => !isInMenu && handleAddItem(undefined, drink.id)}
                    disabled={isInMenu || isAdding}
                  >
                    {isAdding ? 'Adicionando...' : isInMenu ? 'Já no cardápio' : 'Adicionar'}
                  </button>
                </div>
              )
            })
          )
        )}
      </div>

      {showPortionModal && selectedItem && (
        <div className="add-menu-items-modal-overlay" onClick={() => setShowPortionModal(false)}>
          <div className="add-menu-items-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="add-menu-items-modal-title">
              Selecionar Porções - {selectedItem.name}
            </h3>
            
            {loadingPortions ? (
              <div className="add-menu-items-modal-loading">Carregando porções...</div>
            ) : portions.length === 0 ? (
              <div className="add-menu-items-modal-empty">
                <p>Nenhuma porção cadastrada para este item.</p>
                <p>Adicione porções ao item antes de adicioná-lo ao cardápio.</p>
                <button
                  className="add-menu-items-modal-close"
                  onClick={() => setShowPortionModal(false)}
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <div className="add-menu-items-modal-portions">
                  {portions.map(portion => (
                    <label
                      key={portion.id}
                      className={`add-menu-items-modal-portion-item ${selectedPortions.includes(portion.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPortions.includes(portion.id)}
                        onChange={() => handlePortionToggle(portion.id)}
                      />
                      <div className="add-menu-items-modal-portion-info">
                        <span className="add-menu-items-modal-portion-description">
                          {portion.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="add-menu-items-modal-actions">
                  <button
                    className="add-menu-items-modal-cancel"
                    onClick={() => setShowPortionModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="add-menu-items-modal-confirm"
                    onClick={handleConfirmAdd}
                    disabled={selectedPortions.length === 0 || adding !== null}
                  >
                    {adding ? 'Adicionando...' : 'Adicionar ao Cardápio'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
