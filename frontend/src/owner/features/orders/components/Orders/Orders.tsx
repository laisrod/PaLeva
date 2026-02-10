import MenuItemsList from '../../../menus/components/Menu/MenuItemsList'
import Layout from '../../../../shared/components/Layout/Layout'
import { getStatusBadge } from '../../utils/orderStatus'
import { useOrdersPage } from '../../hooks/Orders/useOrdersPage'
import { useInfiniteScroll } from '../../../../../shared/hooks/useInfiniteScroll'
import type { OrderMenuItem } from '../../types/order'
import type { Order } from '../../../../../shared/types/order'
import '../../../../../css/owner/Orders.css'

export default function Orders() {
  const {
    establishmentCode,
    currentOrder,
    loadingCurrentOrder,
    currentOrderError,
    totals,
    itemsCount,
    orderFormRef,
    orders,
    loadingOrders,
    ordersError,
    changeStatus,
    deleteOrder,
    showCreateOrder,
    selectedMenuId,
    selectedDishId,
    selectedDrinkId,
    handleSelectMenu,
    handleToggleDish,
    handleToggleDrink,
    handleSelectDishPortion,
    handleSelectDrinkPortion,
    handleSelectMenuItem,
    menus,
    loadingMenus,
    menuItems,
    loadingMenuItems,
    dishes,
    loadingDishes,
    dishesError,
    drinks,
    loadingDrinks,
    drinksError,
    dishPortions,
    loadingDishPortions,
    drinkPortions,
    loadingDrinkPortions,
    addItem,
    addingItem,
    addItemError,
    customerInfo,
    setCustomerInfo,
    updatingOrder,
    showCustomerModal,
    setShowCustomerModal,
    handleCreateOrder,
    handleClearOrderAndForm,
    handleSaveOrder,
    handleConfirmSaveOrder,
  } = useOrdersPage()

  const { displayedItems, sentinelRef } = useInfiniteScroll<Order>(orders, 12)

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
          <div className="orders-header-actions">
            {!showCreateOrder && !currentOrder && (
              <button
                onClick={handleCreateOrder}
                disabled={loadingCurrentOrder}
                className="orders-btn orders-btn-primary"
              >
                {loadingCurrentOrder ? 'Criando...' : 'Novo Pedido'}
              </button>
            )}
            {currentOrder && (
              <button
                type="button"
                onClick={handleClearOrderAndForm}
                className="orders-btn orders-btn-secondary"
              >
                Voltar para Lista
              </button>
            )}
          </div>
        </div>

        {/* Seção de Criar Pedido */}
        {currentOrder && (
          <div ref={orderFormRef} className="orders-form-section">
            <h2>Criar Novo Pedido</h2>
            
            {currentOrderError && (
              <div className="orders-error">
                Erro: {currentOrderError}
              </div>
            )}

            <div className="orders-order-info">
              <h3>Pedido Atual</h3>
              <p><strong>Código:</strong> {currentOrder.code}</p>
              <p><strong>Status:</strong> {currentOrder.status}</p>
              <p><strong>Itens:</strong> {itemsCount}</p>
              <p><strong>Subtotal:</strong> R$ {totals.subtotal.toFixed(2)}</p>
              <p><strong>Taxa de Serviço (5%):</strong> R$ {totals.serviceFee.toFixed(2)}</p>
              <p><strong>Imposto (10%):</strong> R$ {totals.tax.toFixed(2)}</p>
              <p><strong>Total:</strong> R$ {totals.total.toFixed(2)}</p>
            </div>

            <div className="orders-menu-select">
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
                  onChange={(e) => handleSelectMenu(e.target.value ? parseInt(e.target.value) : undefined)}
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
                <>
                  {loadingMenuItems && (
                    <div className="orders-empty-text-large">Carregando itens do cardápio...</div>
                  )}
                  {!loadingMenuItems && menuItems.length === 0 && (
                    <div className="orders-empty-text-large">
                      <p>Este cardápio não possui itens cadastrados.</p>
                      <p>
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
              <div className="orders-section-divider">
                <h3>Pratos Disponíveis</h3>
                {dishesError && (
                  <div className="orders-error">
                    Erro ao carregar pratos: {dishesError}
                  </div>
                )}
                {loadingDishes ? (
                  <p>Carregando pratos...</p>
                ) : Array.isArray(dishes) && dishes.length > 0 ? (
                  <div>
                    <p className="orders-product-count">
                      {dishes.length} prato(s) disponível(is) - Clique para ver porções
                    </p>
                    {dishes.map((dish) => {
                      const isSelected = selectedDishId === dish.id
                      return (
                        <div
                          key={dish.id}
                          className={`orders-product-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div
                            onClick={() => handleToggleDish(dish.id)}
                            className="orders-product-header"
                          >
                            <div className="orders-product-content">
                              <div className="orders-product-info">
                                <h4>{dish.name}</h4>
                                {dish.description && (
                                  <p>{dish.description}</p>
                                )}
                              </div>
                              <div className="orders-product-arrow">
                                {isSelected ? '▼' : '▶'}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="orders-product-details">
                              {loadingDishPortions ? (
                                <p>Carregando porções...</p>
                              ) : dishPortions.length === 0 ? (
                                <p className="orders-empty-text">Nenhuma porção disponível</p>
                              ) : (
                                <>
                                  <h5>Porções:</h5>
                                  {dishPortions.map((portion) => (
                                    <div
                                      key={portion.id}
                                      onClick={() => handleSelectDishPortion(dish.id, portion.id, 1, addItem)}
                                      className="orders-portion-item"
                                    >
                                      <span className="orders-portion-description">{portion.description}</span>
                                      <span className="orders-portion-price">
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
                  <p className="orders-empty-text">
                    Nenhum prato cadastrado (dishes: {dishes ? `${dishes.length} items` : 'null/undefined'})
                  </p>
                )}
              </div>

              {/* Seção de Bebidas */}
              <div className="orders-section-divider">
                <h3>Bebidas Disponíveis</h3>
                {drinksError && (
                  <div className="orders-error">
                    Erro ao carregar bebidas: {drinksError}
                  </div>
                )}
                {loadingDrinks ? (
                  <p>Carregando bebidas...</p>
                ) : Array.isArray(drinks) && drinks.length > 0 ? (
                  <div>
                    <p className="orders-product-count">
                      {drinks.length} bebida(s) disponível(is) - Clique para ver porções
                    </p>
                    {drinks.map((drink) => {
                      const isSelected = selectedDrinkId === drink.id
                      return (
                        <div
                          key={drink.id}
                          className={`orders-product-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div
                            onClick={() => handleToggleDrink(drink.id)}
                            className="orders-product-header"
                          >
                            <div className="orders-product-content">
                              <div className="orders-product-info">
                                <h4>{drink.name}</h4>
                                {drink.description && (
                                  <p>{drink.description}</p>
                                )}
                              </div>
                              <div className="orders-product-arrow">
                                {isSelected ? '▼' : '▶'}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="orders-product-details">
                              {loadingDrinkPortions ? (
                                <p>Carregando porções...</p>
                              ) : drinkPortions.length === 0 ? (
                                <p className="orders-empty-text">Nenhuma porção disponível</p>
                              ) : (
                                <>
                                  <h5>Porções:</h5>
                                  {drinkPortions.map((portion) => (
                                    <div
                                      key={portion.id}
                                      onClick={() => handleSelectDrinkPortion(drink.id, portion.id, 1, addItem)}
                                      className="orders-portion-item"
                                    >
                                      <span className="orders-portion-description">{portion.description}</span>
                                      <span className="orders-portion-price">
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
                  <p className="orders-empty-text">
                    Nenhuma bebida cadastrada (drinks: {drinks ? `${drinks.length} items` : 'null/undefined'})
                  </p>
                )}
              </div>

              {currentOrder.order_menu_items && currentOrder.order_menu_items.length > 0 && (
                <div className="orders-items-list">
                  <h3>Itens do Pedido</h3>
                  {currentOrder.order_menu_items.map((item: OrderMenuItem) => {
                    const portionPrice = item.portion?.price || 0
                    const itemTotal = portionPrice * item.quantity
                    
                    return (
                      <div key={item.id} className="orders-item-row">
                        <div className="orders-item-info">
                          <p>
                            {item.menu_item?.name || `Item #${item.menu_item_id}`}
                          </p>
                          <p>
                            {item.portion?.description || `Porção #${item.portion_id}`}
                          </p>
                        </div>
                        <div className="orders-item-price">
                          <p>Qtd: {item.quantity}</p>
                          <p>
                            R$ {itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Resumo dos Totais */}
                  <div className="orders-totals">
                    <div className="orders-total-row">
                      <span>Subtotal:</span>
                      <span>R$ {totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="orders-total-row">
                      <span>Taxa de Serviço (5%):</span>
                      <span>R$ {totals.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="orders-total-row">
                      <span>Imposto (10%):</span>
                      <span>R$ {totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="orders-total-final">
                      <span>Total:</span>
                      <span>R$ {totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Salvar Pedido */}
              <div className="orders-save-section">
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={updatingOrder || !currentOrder || (currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0)}
                  className="orders-save-btn orders-btn-success"
                >
                  {updatingOrder ? 'Salvando...' : 'Salvar Pedido'}
                </button>
                {(!customerInfo.customer_email && !customerInfo.customer_phone) && (
                  <p className="orders-save-warning">
                    É necessário informar pelo menos um email ou telefone para salvar o pedido
                  </p>
                )}
                {currentOrder && currentOrder.order_menu_items && currentOrder.order_menu_items.length === 0 && (
                  <p className="orders-save-warning">
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
            className="orders-modal-overlay"
            onClick={() => setShowCustomerModal(false)}
          >
            <div 
              className="orders-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Informações do Cliente</h2>
              
              <div className="orders-modal-field">
                <label>
                  Nome:
                </label>
                <input
                  type="text"
                  value={customerInfo.customer_name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                  className="orders-modal-input"
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="orders-modal-field">
                <label>
                  Email: <span>(opcional)</span>
                </label>
                <input
                  type="email"
                  value={customerInfo.customer_email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                  className="orders-modal-input"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="orders-modal-field">
                <label>
                  Telefone: <span>(opcional)</span>
                </label>
                <input
                  type="tel"
                  value={customerInfo.customer_phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                  className="orders-modal-input"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="orders-modal-field">
                <label>
                  CPF: <span>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.customer_cpf}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, customer_cpf: e.target.value })}
                  className="orders-modal-input"
                  placeholder="000.000.000-00"
                />
              </div>

              {(!customerInfo.customer_email && !customerInfo.customer_phone) && (
                <p className="orders-modal-warning">
                  É necessário informar pelo menos um email ou telefone para salvar o pedido
                </p>
              )}

              <div className="orders-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  disabled={updatingOrder}
                  className="orders-modal-btn orders-modal-btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSaveOrder}
                  disabled={updatingOrder || (!customerInfo.customer_email && !customerInfo.customer_phone)}
                  className="orders-modal-btn orders-modal-btn-save"
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
              <>
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
                <div ref={sentinelRef} data-testid="infinite-scroll-sentinel" style={{ height: 1 }} aria-hidden="true" />
              </>
            )}
            
            {/* Botão para criar novo pedido */}
            <div className="orders-footer-actions">
              <button
                onClick={handleCreateOrder}
                disabled={loadingCurrentOrder}
                className="orders-btn orders-btn-primary orders-btn-medium"
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
