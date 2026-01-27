import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useCurrentOrder } from '../../hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../hooks/Orders/useAddOrderItem'
import { useMenus } from '../../hooks/Menu/useMenus'
import { useMenuItems } from '../../hooks/Menu/useMenuItems'
import MenuItemsList from '../Menu/MenuItemsList'
import Layout from '../Layout/Layout'

export default function TestCreateOrder() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { 
    currentOrder, 
    loading, 
    error, 
    createNewOrder, 
    clearOrder,
    loadOrder,
    totals,
    itemsCount
  } = useCurrentOrder({
    establishmentCode: code,
    autoCreate: false // Não criar automaticamente, apenas quando clicar no botão
  })

  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(undefined)

  const { menus, loading: loadingMenus } = useMenus(code)
  const { menuItems, loading: loadingMenuItems } = useMenuItems({
    menuId: selectedMenuId,
    establishmentCode: code
  })

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode: code,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      // Recarregar pedido para atualizar itens
      if (currentOrder) {
        loadOrder(currentOrder.code)
      }
    }
  })

  const handleCreateOrder = async () => {
    await createNewOrder('Cliente Teste')
  }

  const handleSelectItem = async (menuItemId: number, portionId: number, quantity: number) => {
    await addItem({ menuItemId, portionId, quantity })
  }

  return (
    <Layout>
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1>Teste: Criar Pedido</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={handleCreateOrder}
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Criando...' : 'Criar Pedido Draft'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            Erro: {error}
          </div>
        )}

        {currentOrder && (
          <>
            <div style={{
              padding: '15px',
              backgroundColor: '#efe',
              borderRadius: '5px',
              marginTop: '20px',
              marginBottom: '20px'
            }}>
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

            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <h3>Selecionar Cardápio</h3>
              {loadingMenus ? (
                <p>Carregando cardápios...</p>
              ) : menus.length === 0 ? (
                <p style={{ color: '#999', fontStyle: 'italic' }}>
                  Nenhum cardápio disponível. Crie um cardápio primeiro.
                </p>
              ) : (
                <select
                  value={selectedMenuId || ''}
                  onChange={(e) => setSelectedMenuId(e.target.value ? parseInt(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    marginBottom: '15px'
                  }}
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
                <div style={{
                  padding: '10px',
                  backgroundColor: '#fee',
                  color: '#c33',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
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
              <div style={{
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '5px',
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}>
                <h3>Itens do Pedido</h3>
                {currentOrder.order_menu_items.map((item) => (
                  <div key={item.id} style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>
                        {item.menu_item?.name || `Item #${item.menu_item_id}`}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                        {(item.portion as any)?.description || (item.portion as any)?.name || `Porção #${item.portion_id}`}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0 }}>
                        Qtd: {item.quantity}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
                        R$ {((item.portion?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={clearOrder}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Limpar Pedido
            </button>
          </>
        )}
      </div>
    </Layout>
  )
}
