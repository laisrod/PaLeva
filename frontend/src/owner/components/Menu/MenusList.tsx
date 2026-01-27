import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import OrderSidebar from '../Orders/OrderSidebar'
import { useMenusPage } from '../../hooks/Menu/useMenusPage'
import MenusListLoading from './MenusListLoading'
import '../../../css/owner/MenusList.css'

export default function MenusList() {
  const {
    establishmentCode,
    isOwner,
    menus,
    loading,
    error,
    deleteMenu
  } = useMenusPage()

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
          <div className="menus-grid">
            {menus.map(menu => (
              <div key={menu.id} className="menu-card">
                <h3 className="menu-card-title">{menu.name}</h3>
                {menu.description && (
                  <p className="menu-card-description">{menu.description}</p>
                )}

                <div className="menu-card-actions">
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
                            deleteMenu(menu.id)
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
            ))}
          </div>
        )}
      </div>
      
      <OrderSidebar establishmentCode={establishmentCode} />
    </Layout>
  )
}

