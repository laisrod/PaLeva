import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
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
        <div className="menus-header">
          <h1>Cardápios</h1>
          <div>
            <Link
              to={`/establishment/${establishmentCode}`}
              className="btn btn-outline-secondary me-2"
            >
              Voltar
            </Link>
            {isOwner && (
              <Link
                to={`/establishment/${establishmentCode}/menus/new`}
                className="btn btn-primary"
              >
                Novo Cardápio
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger mb-4">{error}</div>
        )}

        {menus.length === 0 ? (
          <div className="alert alert-info">Nenhum cardápio cadastrado</div>
        ) : (
          <div className="menus-grid">
            {menus.map(menu => (
              <div key={menu.id} className="menu-card">
                <h3 className="menu-card-title">{menu.name}</h3>
                <p className="menu-card-text">{menu.description}</p>

                <div className="btn-group">
                  <Link
                    to={`/establishment/${establishmentCode}/menus/${menu.id}`}
                    className="btn btn-outline-primary"
                  >
                    Ver
                  </Link>
                  {isOwner && (
                    <>
                      <Link
                        to={`/establishment/${establishmentCode}/menus/${menu.id}/edit`}
                        className="btn btn-outline-secondary"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteMenu(menu.id)}
                        className="btn btn-outline-danger"
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
    </Layout>
  )
}

