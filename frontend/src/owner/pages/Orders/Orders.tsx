import { useState, useEffect, useRef } from 'react'
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
import { ownerApi } from '../../services/api'
import '../../../css/owner/pages/Orders.css'

export default function Orders() {
  useRequireAuth()
  const { code } = useParams<{ code: string }>()
  const { user } = useAuth()
  const establishmentCode = code || user?.establishment?.code || localStorage.getItem('establishment_code') || undefined
  
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

  const orderFormRef = useRef<HTMLDivElement>(null)

  const { orders, loading: loadingOrders, error: ordersError, changeStatus, deleteOrder, refetch: refetchOrders } = useOrders(establishmentCode, {
    onMissingContactInfo: async (orderCode: string) => {
      // Carregar o pedido no formulário quando faltar informações de contato
      await loadOrder(orderCode)
      // Scroll para o formulário após carregar
      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  })

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
    handleClearOrder()
    clearOrder()
  }

  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_cpf: ''
  })
  const [updatingOrder, setUpdatingOrder] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)

  // Inicializar informações do cliente quando o pedido carregar
  useEffect(() => {
    if (currentOrder) {
      setCustomerInfo({
        customer_name: currentOrder.customer_name || '',
        customer_email: currentOrder.customer_email || '',
        customer_phone: currentOrder.customer_phone || '',
        customer_cpf: currentOrder.customer_cpf || ''
      })
    }
  }, [currentOrder])

  const handleUpdateCustomerInfo = async () => {
    if (!currentOrder || !establishmentCode) return

    if (!customerInfo.customer_email && !customerInfo.customer_phone) {
      alert('É necessário informar pelo menos um email ou telefone')
      return
    }

    setUpdatingOrder(true)
    try {
      const response = await ownerApi.updateOrder(establishmentCode, currentOrder.code, customerInfo)
      if (response.error) {
        alert(response.error)
      } else {
        // Recarregar a lista de pedidos para refletir as atualizações
        await refetchOrders()
        // Limpar o pedido atual para voltar à lista
        clearOrder()
        handleClearOrder()
        alert('Informações do cliente atualizadas!')
      }
    } catch (err) {
      alert('Erro ao atualizar informações do cliente')
    } finally {
      setUpdatingOrder(false)
    }
  }

  const handleSaveOrder = () => {
    if (!currentOrder || !establishmentCode) return

    // Verificar se há itens no pedido
    if (!currentOrder.order_menu_items || currentOrder.order_menu_items.length === 0) {
      alert('Adicione pelo menos um item ao pedido antes de salvar')
      return
    }

    // Abrir modal de informações do cliente
    setShowCustomerModal(true)
  }

  const handleConfirmSaveOrder = async () => {
    if (!currentOrder || !establishmentCode) return

    // Verificar se tem email ou telefone
    if (!customerInfo.customer_email && !customerInfo.customer_phone) {
      alert('É necessário informar pelo menos um email ou telefone para salvar o pedido')
      return
    }

    setUpdatingOrder(true)
    try {
      // Primeiro, atualizar as informações do cliente
      const updateResponse = await ownerApi.updateOrder(establishmentCode, currentOrder.code, customerInfo)
      if (updateResponse.error) {
        alert(updateResponse.error)
        return
      }

      // Se o pedido estiver em draft, confirmar (mudar para pending)
      if (currentOrder.status === 'draft' || !currentOrder.status) {
        await changeStatus(currentOrder.code, 'confirm')
        // Aguardar um pouco para o status ser atualizado
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Fechar o modal
      setShowCustomerModal(false)

      // Recarregar a lista de pedidos
      await refetchOrders()
      // Limpar o pedido atual para voltar à lista
      clearOrder()
      handleClearOrder()
      alert('Pedido salvo com sucesso!')
    } catch (err) {
      alert('Erro ao salvar pedido')
    } finally {
      setUpdatingOrder(false)
    }
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
                type="button"
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
          <div ref={orderFormRef} style={{
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

              {/* Botão de Salvar Pedido */}
              <div style={{
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '2px solid #ddd',
                textAlign: 'center'
              }}>
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={updatingOrder || !currentOrder || (currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0)}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    backgroundColor: updatingOrder || !currentOrder || (currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0) ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: updatingOrder || !currentOrder || (currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!updatingOrder && currentOrder && currentOrder.order_menu_items && currentOrder.order_menu_items.length > 0) {
                      e.currentTarget.style.backgroundColor = '#218838'
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!updatingOrder && currentOrder && currentOrder.order_menu_items && currentOrder.order_menu_items.length > 0) {
                      e.currentTarget.style.backgroundColor = '#28a745'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  {updatingOrder ? 'Salvando...' : '💾 Salvar Pedido'}
                </button>
                {(!customerInfo.customer_email && !customerInfo.customer_phone) && (
                  <p style={{ marginTop: '15px', color: '#dc3545', fontSize: '14px' }}>
                    É necessário informar pelo menos um email ou telefone para salvar o pedido
                  </p>
                )}
                {currentOrder && currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0 && (
                  <p style={{ marginTop: '15px', color: '#dc3545', fontSize: '14px' }}>
                    Adicione pelo menos um item ao pedido antes de salvar
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Informações do Cliente */}
        {showCustomerModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowCustomerModal(false)}
          >
            <div 
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Informações do Cliente</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nome:
                </label>
                <input
                  type="text"
                  value={customerInfo.customer_name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome do cliente"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email: <span style={{ color: '#999', fontSize: '12px' }}>(opcional)</span>
                </label>
                <input
                  type="email"
                  value={customerInfo.customer_email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Telefone: <span style={{ color: '#999', fontSize: '12px' }}>(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.customer_phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  CPF: <span style={{ color: '#999', fontSize: '12px' }}>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.customer_cpf}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_cpf: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="000.000.000-00"
                />
              </div>

              {(!customerInfo.customer_email && !customerInfo.customer_phone) && (
                <p style={{ marginBottom: '15px', color: '#dc3545', fontSize: '14px' }}>
                  É necessário informar pelo menos um email ou telefone para salvar o pedido
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  disabled={updatingOrder}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: updatingOrder ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveOrder}
                  disabled={updatingOrder || (!customerInfo.customer_email && !customerInfo.customer_phone)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: updatingOrder || (!customerInfo.customer_email && !customerInfo.customer_phone) ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: updatingOrder || (!customerInfo.customer_email && !customerInfo.customer_phone) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {updatingOrder ? 'Salvando...' : 'Salvar Pedido'}
                </button>
              </div>
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
                            {/* draft: Botão "Confirmar" → pending */}
                            {(order.status === 'draft' || !order.status) && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Deseja confirmar este pedido? Ele entrará no fluxo de produção.')) {
                                    changeStatus(order.code, 'confirm')
                                  }
                                }}
                                className="order-action-btn order-action-btn-primary"
                              >
                                Confirmar
                              </button>
                            )}
                            
                            {/* pending: Botão "Iniciar preparo" → preparing e "Cancelar" */}
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => changeStatus(order.code, 'prepare')}
                                  className="order-action-btn order-action-btn-warning"
                                >
                                  Iniciar Preparo
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Motivo do cancelamento:')
                                    if (reason !== null) {
                                      changeStatus(order.code, 'cancel')
                                    }
                                  }}
                                  className="order-action-btn order-action-btn-danger"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            
                            {/* preparing: Botão "Pronto para entrega/retirada" → ready e "Cancelar" */}
                            {order.status === 'preparing' && (
                              <>
                                <button
                                  onClick={() => changeStatus(order.code, 'ready')}
                                  className="order-action-btn order-action-btn-success"
                                >
                                  Pronto para entrega/retirada
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Motivo do cancelamento:')
                                    if (reason !== null) {
                                      changeStatus(order.code, 'cancel')
                                    }
                                  }}
                                  className="order-action-btn order-action-btn-danger"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            
                            {/* ready: Botão "Marcar como entregue" → delivered e "Cancelar" (se ainda não saiu) */}
                            {order.status === 'ready' && (
                              <>
                                <button
                                  onClick={() => changeStatus(order.code, 'deliver')}
                                  className="order-action-btn order-action-btn-success"
                                >
                                  Marcar como entregue
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Motivo do cancelamento:')
                                    if (reason !== null) {
                                      changeStatus(order.code, 'cancel')
                                    }
                                  }}
                                  className="order-action-btn order-action-btn-danger"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            
                            {/* delivered e cancelled: Nenhum botão (finalizado) */}
                            
                            {/* Botão de deletar - disponível para todos os status */}
                            <button
                              onClick={() => {
                                if (window.confirm('Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.')) {
                                  deleteOrder(order.code)
                                }
                              }}
                              className="order-action-btn order-action-btn-danger"
                              style={{ marginLeft: '10px' }}
                            >
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Botão para criar novo pedido */}
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            borderTop: '1px solid #ddd' 
          }}>
            <button
              onClick={handleCreateOrder}
              disabled={loadingCurrentOrder}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loadingCurrentOrder ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loadingCurrentOrder ? 'Criando...' : 'Novo Pedido'}
            </button>
          </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

