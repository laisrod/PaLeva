import MenuItemsList from '../../../menus/components/Menu/MenuItemsList'
import Layout from '../../../../shared/components/Layout/Layout'
import { useTestCreateOrderPage } from '../../hooks/Orders/useTestCreateOrderPage'
import '../../../../../css/owner/Orders.css'

export default function TestCreateOrder() {
  const {
    currentOrder,
    loading,
    error,
    totals,
    itemsCount,
    menus,
    loadingMenus,
    selectedMenuId,
    setSelectedMenuId,
    menuItems,
    loadingMenuItems,
    addItemError,
    addingItem,
    handleCreateOrder,
    handleSelectItem,
    clearOrder,
  } = useTestCreateOrderPage()

  return (
    <Layout>
      <div className="orders-test-container">
        <h1>Teste: Criar Pedido</h1>
        
        <div className="orders-test-section">
          <button 
            onClick={handleCreateOrder}
            disabled={loading}
            className="orders-btn orders-btn-primary"
          >
            {loading ? 'Criando...' : 'Criar Pedido Draft'}
          </button>
        </div>

        {error && (
          <div className="orders-error">
            Erro: {error}
          </div>
        )}

        {currentOrder && (
          <>
            <div className="orders-test-order-info">
              <h3>Pedido Atual</h3>
              <p><strong>ID:</strong> {currentOrder.id}</p>
              <p><strong>Código:</strong> {currentOrder.code}</p>
              <p><strong>Status:</strong> {currentOrder.status}</p>
              <p><strong>Itens:</strong> {itemsCount}</p>
              <p><strong>Subtotal:</strong> R$ {totals.subtotal.toFixed(2)}</p>
              <p><strong>Taxa de Serviço (5%):</strong> R$ {totals.serviceFee.toFixed(2)}</p>
              <p><strong>Imposto (10%):</strong> R$ {totals.tax.toFixed(2)}</p>
              <p><strong>Total:</strong> R$ {totals.total.toFixed(2)}</p>
              {currentOrder.customer_name && (
                <p><strong>Cliente:</strong> {currentOrder.customer_name}</p>
              )}
            </div>

            <div className="orders-test-menu-section">
              <h3>Selecionar Cardápio</h3>
              {loadingMenus ? (
                <p>Carregando cardápios...</p>
              ) : menus.length === 0 ? (
                <p className="orders-empty-text">
                  Nenhum cardápio disponível. Crie um cardápio primeiro.
                </p>
              ) : (
                <select
                  value={selectedMenuId || ''}
                  onChange={(e) => setSelectedMenuId(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="orders-select"
                >
                  <option value="">Selecione um cardápio...</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              )}

              {addItemError && (
                <div className="orders-error">
                  Erro: {addItemError}
                </div>
              )}

              {selectedMenuId && (
                <MenuItemsList
                  menuItems={menuItems}
                  onSelectItem={handleSelectItem}
                  loading={loadingMenuItems || addingItem}
                />
              )}
            </div>

            {currentOrder.order_menu_items && currentOrder.order_menu_items.length > 0 && (
              <div className="orders-items-list">
                <h3>Itens do Pedido</h3>
                {currentOrder.order_menu_items.map((item) => (
                  <div key={item.id} className="orders-item-row">
                    <div className="orders-item-info">
                      <p>
                        {item.menu_item?.name || `Item #${item.menu_item_id}`}
                      </p>
                      <p>
                        {(item.portion as any)?.description || (item.portion as any)?.name || `Porção #${item.portion_id}`}
                      </p>
                    </div>
                    <div className="orders-item-price">
                      <p>
                        Qtd: {item.quantity}
                      </p>
                      <p>
                        R$ {((item.portion?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={clearOrder}
              className="orders-btn orders-btn-danger orders-btn-full"
            >
              Limpar Pedido
            </button>
          </>
        )}
      </div>
    </Layout>
  )
}
