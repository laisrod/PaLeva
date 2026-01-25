import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useOrders } from '../../hooks/Orders/useOrders'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useCurrentOrder } from '../../hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../hooks/Orders/useAddOrderItem'
import { useOrderForm } from '../../hooks/Orders/useOrderForm'
import { useMenus } from '../../hooks/useMenus'
import { useMenuItems } from '../../hooks/useMenuItems'
import { useDishes } from '../../hooks/Dish/useDishes'
import { useDrinks } from '../../hooks/Drink/useDrinks'
import { useDishPortions } from '../../hooks/DishPortion/useDishPortions'
import { useDrinkPortions } from '../../hooks/DrinkPortion/useDrinkPortions'
import MenuItemsList from '../../components/MenuItemsList'
import Layout from '../../components/Layout'
import { getStatusBadge } from '../../utils/orderStatus'
import '../../../css/owner/pages/Orders.css'

export default function Orders() {
  useRequireAuth()
  const { code } = useParams<{ code: string }>()
  const { user } = useAuth()
  const establishmentCode = code || user?.establishment?.code || localStorage.getItem('establishment_code') || undefined
  
  const { orders, loading: loadingOrders, error: ordersError, changeStatus } = useOrders(establishmentCode)
  
  const { 
    currentOrder, 
    loading: loadingCurrentOrder, 
    error: currentOrderError, 
    createNewOrder, 
    clearOrder,
    loadOrder,
    totals,
    itemsCount
  } = useCurrentOrder({
    establishmentCode: establishmentCode,
    autoCreate: false
  })

  const {
    showCreateOrder,
    selectedMenuId,
    selectedDishId,
    selectedDrinkId,
    handleCreateOrder: handleCreateOrderForm,
    handleClearOrder,
    handleSelectMenu,
    handleToggleDish,
    handleToggleDrink,
    handleSelectDishPortion,
    handleSelectDrinkPortion,
    handleSelectMenuItem,
  } = useOrderForm()

  const { menus, loading: loadingMenus } = useMenus(establishmentCode)
  const { menuItems, loading: loadingMenuItems } = useMenuItems({
    menuId: selectedMenuId,
    establishmentCode: establishmentCode
  })
  const { dishes, loading: loadingDishes, error: dishesError } = useDishes(establishmentCode)
  const { drinks, loading: loadingDrinks, error: drinksError } = useDrinks(establishmentCode)
  const { portions: dishPortions, loading: loadingDishPortions } = useDishPortions(establishmentCode, selectedDishId)
  const { portions: drinkPortions, loading: loadingDrinkPortions } = useDrinkPortions(establishmentCode, selectedDrinkId)

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode: establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      if (currentOrder) {
        loadOrder(currentOrder.code)
      }
    }
  })

  const handleCreateOrder = () => {
    handleCreateOrderForm(createNewOrder)
  }

  const handleClearOrderAndForm = () => {
    clearOrder()
    handleClearOrder()
  }

  if (loadingOrders && (!orders || orders.length === 0)) {
    return (
      <Layout>
        <div className="container mt-4">
          <div className="loading">Carregando pedidos...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">Pedidos</h1>
          <div style={{ marginTop: '10px' }}>
            {!showCreateOrder && !currentOrder && (
              <button
                onClick={handleCreateOrder}
                disabled={loadingCurrentOrder}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loadingCurrentOrder ? 'not-allowed' : 'pointer'
                }}
              >
                {loadingCurrentOrder ? 'Criando...' : 'Novo Pedido'}
              </button>
            )}
            {currentOrder && (
              <button
                onClick={handleClearOrderAndForm}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                Voltar para Lista
              </button>
            )}
          </div>
        </div>

        {/* Seção de Criar Pedido */}
        {currentOrder && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ marginTop: 0 }}>Criar Novo Pedido</h2>
            
            {currentOrderError && (
              <div style={{
                padding: '10px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '5px',
                marginBottom: '15px'
              }}>
                Erro: {currentOrderError}
              </div>
            )}

            <div style={{
              padding: '15px',
              backgroundColor: '#efe',
              borderRadius: '5px',
              marginBottom: '20px'
            }}>
              <h3>Pedido Atual</h3>
              <p><strong>Código:</strong> {currentOrder.code}</p>
              <p><strong>Status:</strong> {currentOrder.status}</p>
              <p><strong>Itens:</strong> {itemsCount}</p>
              <p><strong>Subtotal:</strong> R$ {totals.subtotal.toFixed(2)}</p>
              <p><strong>Taxa de Serviço (5%):</strong> R$ {totals.serviceFee.toFixed(2)}</p>
              <p><strong>Imposto (10%):</strong> R$ {totals.tax.toFixed(2)}</p>
              <p><strong>Total:</strong> R$ {totals.total.toFixed(2)}</p>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#fff',
              borderRadius: '5px',
              marginBottom: '20px',
              border: '1px solid #ddd'
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
                  onChange={(e) => handleSelectMenu(e.target.value ? parseInt(e.target.value) : undefined)}
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
                <>
                  {loadingMenuItems && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Carregando itens do cardápio...</div>
                  )}
                  {!loadingMenuItems && menuItems.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      <p>Este cardápio não possui itens cadastrados.</p>
                      <p style={{ fontSize: '14px', marginTop: '10px', color: '#999' }}>
                        Vá em "Cardápios" → Editar este cardápio → Adicione pratos ou bebidas.
                      </p>
                    </div>
                  )}
                  {!loadingMenuItems && menuItems.length > 0 && (
                    <MenuItemsList
                      menuItems={menuItems}
                      onSelectItem={(menuItemId, portionId, quantity) => 
                        handleSelectMenuItem(menuItemId, portionId, quantity, addItem)
                      }
                      loading={addingItem}
                    />
                  )}
                </>
              )}

              {/* Seção de Pratos */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
                <h3 style={{ marginBottom: '15px' }}>Pratos Disponíveis</h3>
                {dishesError && (
                  <div style={{ padding: '10px', backgroundColor: '#fee', color: '#c33', borderRadius: '5px', marginBottom: '10px' }}>
                    Erro ao carregar pratos: {dishesError}
                  </div>
                )}
                {loadingDishes ? (
                  <p>Carregando pratos...</p>
                ) : Array.isArray(dishes) && dishes.length > 0 ? (
                  <div>
                    <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                      {dishes.length} prato(s) disponível(is) - Clique para ver porções
                    </p>
                    {dishes.map((dish) => {
                      const isSelected = selectedDishId === dish.id
                      return (
                        <div
                          key={dish.id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            overflow: 'hidden',
                            backgroundColor: isSelected ? '#f0f8ff' : '#fff'
                          }}
                        >
                          <div
                            onClick={() => handleToggleDish(dish.id)}
                            style={{
                              padding: '15px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                              borderBottom: isSelected ? '2px solid #2196f3' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h4 style={{ margin: 0, color: '#333' }}>{dish.name}</h4>
                                {dish.description && (
                                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    {dish.description}
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
                              {loadingDishPortions ? (
                                <p>Carregando porções...</p>
                              ) : dishPortions.length === 0 ? (
                                <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhuma porção disponível</p>
                              ) : (
                                <>
                                  <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>Porções:</h5>
                                  {dishPortions.map((portion) => (
                                    <div
                                      key={portion.id}
                                      onClick={() => handleSelectDishPortion(dish.id, portion.id, 1, addItem)}
                                      style={{
                                        padding: '10px',
                                        marginBottom: '8px',
                                        border: '2px solid #2196f3',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: '#e3f2fd',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <span style={{ fontWeight: 'bold' }}>{portion.description}</span>
                                      <span style={{ color: '#2196f3', fontWeight: 'bold' }}>
                                        R$ {portion.price.toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>
                    Nenhum prato cadastrado (dishes: {dishes ? `${dishes.length} items` : 'null/undefined'})
                  </p>
                )}
              </div>

              {/* Seção de Bebidas */}
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
                <h3 style={{ marginBottom: '15px' }}>Bebidas Disponíveis</h3>
                {drinksError && (
                  <div style={{ padding: '10px', backgroundColor: '#fee', color: '#c33', borderRadius: '5px', marginBottom: '10px' }}>
                    Erro ao carregar bebidas: {drinksError}
                  </div>
                )}
                {loadingDrinks ? (
                  <p>Carregando bebidas...</p>
                ) : Array.isArray(drinks) && drinks.length > 0 ? (
                  <div>
                    <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px', fontWeight: 'bold' }}>
                      {drinks.length} bebida(s) disponível(is) - Clique para ver porções
                    </p>
                    {drinks.map((drink) => {
                      const isSelected = selectedDrinkId === drink.id
                      return (
                        <div
                          key={drink.id}
                          style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            overflow: 'hidden',
                            backgroundColor: isSelected ? '#f0f8ff' : '#fff'
                          }}
                        >
                          <div
                            onClick={() => handleToggleDrink(drink.id)}
                            style={{
                              padding: '15px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                              borderBottom: isSelected ? '2px solid #2196f3' : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h4 style={{ margin: 0, color: '#333' }}>{drink.name}</h4>
                                {drink.description && (
                                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    {drink.description}
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
                              {loadingDrinkPortions ? (
                                <p>Carregando porções...</p>
                              ) : drinkPortions.length === 0 ? (
                                <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhuma porção disponível</p>
                              ) : (
                                <>
                                  <h5 style={{ margin: '0 0 10px 0', color: '#555' }}>Porções:</h5>
                                  {drinkPortions.map((portion) => (
                                    <div
                                      key={portion.id}
                                      onClick={() => handleSelectDrinkPortion(drink.id, portion.id, 1, addItem)}
                                      style={{
                                        padding: '10px',
                                        marginBottom: '8px',
                                        border: '2px solid #2196f3',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: '#e3f2fd',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <span style={{ fontWeight: 'bold' }}>{portion.description}</span>
                                      <span style={{ color: '#2196f3', fontWeight: 'bold' }}>
                                        R$ {portion.price.toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>
                    Nenhuma bebida cadastrada (drinks: {drinks ? `${drinks.length} items` : 'null/undefined'})
                  </p>
                )}
              </div>

              {currentOrder.order_menu_items && currentOrder.order_menu_items.length > 0 && (
                <div style={{
                  padding: '15px',
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  marginTop: '20px',
                  border: '1px solid #ddd'
                }}>
                  <h3>Itens do Pedido</h3>
                  {currentOrder.order_menu_items.map((item) => {
                    const portionPrice = item.portion?.price || 0
                    const itemTotal = portionPrice * item.quantity
                    
                    return (
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
                            {item.portion?.description || `Porção #${item.portion_id}`}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: 0 }}>Qtd: {item.quantity}</p>
                          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
                            R$ {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Resumo dos Totais */}
                  <div style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '2px solid #ddd'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <span>Subtotal:</span>
                      <span>R$ {totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <span>Taxa de Serviço (5%):</span>
                      <span>R$ {totals.serviceFee.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <span>Imposto (10%):</span>
                      <span>R$ {totals.tax.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #ddd',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#dc3545'
                    }}>
                      <span>Total:</span>
                      <span>R$ {totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seção de Lista de Pedidos */}
        {!currentOrder && (
          <div className="orders-card">
            <div className="orders-card-header">
              <h2>Lista de Pedidos</h2>
            </div>

            {ordersError && (
              <div className="orders-alert orders-alert-danger">
                {ordersError}
              </div>
            )}

          {orders.length === 0 ? (
            <div className="orders-alert orders-alert-info">
              Nenhum pedido encontrado
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th>Valor Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="order-code">#{order.code}</div>
                          {order.customer_name && (
                            <div className="order-customer">{order.customer_name}</div>
                          )}
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: statusBadge.color }}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td>{new Date(order.created_at).toLocaleString('pt-BR')}</td>
                        <td>R$ {(Number(order.total_price) || 0).toFixed(2)}</td>
                        <td>
                          <div className="order-actions">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => changeStatus(order.code, 'prepare')}
                                className="order-action-btn order-action-btn-warning"
                              >
                                Iniciar Preparo
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => changeStatus(order.code, 'ready')}
                                className="order-action-btn order-action-btn-success"
                              >
                                Marcar como Pronto
                              </button>
                            )}
                            {!['delivered', 'cancelled'].includes(order.status) && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Motivo do cancelamento:')
                                  if (reason) {
                                    changeStatus(order.code, 'cancel')
                                  }
                                }}
                                className="order-action-btn order-action-btn-danger"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          </div>
        )}
      </div>
    </Layout>
  )
}

