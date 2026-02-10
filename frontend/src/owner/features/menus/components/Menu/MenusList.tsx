import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import OrderSidebar from '../../../orders/components/Orders/OrderSidebar'
import { useMenusPage } from '../../hooks/Menu/useMenusPage'
import { useMenuCard } from '../../hooks/Menu/useMenuCard'
import { useInfiniteScroll } from '../../../../../shared/hooks/useInfiniteScroll'
import { Menu } from '../../types/menu'
import MenusListLoading from './MenusListLoading'
import '../../../../../css/owner/MenusList.css'

export default function MenusList() {
  const {
    establishmentCode,
    isOwner,
    menus,
    loading,
    error,
    deleteMenu
  } = useMenusPage()

  const { displayedItems, sentinelRef } = useInfiniteScroll<Menu>(menus, 12)

  if (loading) {
    return <MenusListLoading />
  }

  return (
    <Layout>
      <div className="menus-list-container">
        <div className="menus-list-header">
          <div className="menus-list-header-top">
            <h1 className="menus-list-title">Cardápios</h1>
            <div className="menus-list-actions">
              {isOwner && (
                <Link
                  to={`/establishment/${establishmentCode}/menus/new`}
                  className="menus-list-btn menus-list-btn-primary"
                >
                  Novo Cardápio
                </Link>
              )}
            </div>
          </div>
          
          <div className="menus-search-container">
            <div className="menus-search-wrapper">
              <span className="menus-search-icon"></span>
              <input
                type="text"
                className="menus-search-input"
                placeholder="Search for food, coffee, etc.."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}

        {menus.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum cardápio cadastrado</p>
          </div>
        ) : (
          <>
            <div className="menus-grid">
              {displayedItems.map(menu => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  establishmentCode={establishmentCode}
                  isOwner={isOwner}
                  onDelete={deleteMenu}
                />
              ))}
            </div>
            <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />
          </>
        )}
      </div>
      
      <OrderSidebar establishmentCode={establishmentCode} />
    </Layout>
  )
}

function MenuCard({ menu, establishmentCode, isOwner, onDelete }: { 
  menu: { id: number; name: string; description?: string; price?: number }
  establishmentCode: string
  isOwner: boolean
  onDelete: (menuId: number) => void
}) {
  const {
    showItemModal,
    setShowItemModal,
    selectedMenuItemId,
    setSelectedMenuItemId,
    selectedPortionId,
    setSelectedPortionId,
    menuItems,
    loadingMenuItems,
    successMessage,
    addingItem,
    handleAddToOrder,
    handleConfirmAddToOrder
  } = useMenuCard({ menuId: menu.id, establishmentCode })

  return (
    <>
      <div className="menu-card">
        <h3 className="menu-card-title">{menu.name}</h3>
        {menu.description && (
          <p className="menu-card-description">{menu.description}</p>
        )}
        {menu.price !== undefined && menu.price !== null && typeof menu.price === 'number' && (
          <p className="menu-card-price">R$ {Number(menu.price).toFixed(2)}</p>
        )}

        {successMessage && (
          <div className="menu-card-success-message">
            {successMessage}
          </div>
        )}

        <div className="menu-card-actions">
          <button
            className="menu-card-btn menu-card-btn-add"
            onClick={handleAddToOrder}
            disabled={addingItem || loadingMenuItems}
          >
            {addingItem ? 'Adicionando...' : 'Add to Order'}
          </button>
          <Link
            to={`/establishment/${establishmentCode}/menus/${menu.id}`}
            className="menu-card-btn menu-card-btn-primary"
          >
            Ver
          </Link>
          {isOwner && (
            <>
              <Link
                to={`/establishment/${establishmentCode}/menus/${menu.id}/edit`}
                className="menu-card-btn menu-card-btn-secondary"
              >
                Editar
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este cardápio?')) {
                    onDelete(menu.id)
                  }
                }}
                className="menu-card-btn menu-card-btn-danger"
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

    </>
  )
}

