import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useViewMenuPage } from '../../hooks/Menu/useViewMenuPage'
import ViewMenuLoading from './ViewMenuLoading'
import '../../../css/owner/ViewMenu.css'

export default function ViewMenu() {
  const {
    establishmentCode,
    menuId,
    menuData,
    loading,
    error
  } = useViewMenuPage()

  if (loading) {
    return <ViewMenuLoading />
  }

  if (error) {
    return (
      <Layout>
        <div className="view-menu-container">
          <div className="error-message">
            <p>{error}</p>
            <Link to={`/establishment/${establishmentCode}/menus`} className="btn-back">
              ← Voltar para lista de cardápios
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (!menuData) {
    return (
      <Layout>
        <div className="view-menu-container">
          <p>Cardápio não encontrado</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="view-menu-container">
        <div className="view-menu-header">
          <Link
            to={`/establishment/${establishmentCode}/menus`}
            className="btn-back"
          >
            ← Voltar
          </Link>
          <Link
            to={`/establishment/${establishmentCode}/menus/${menuData.id}/edit`}
            className="btn-edit"
          >
            Editar
          </Link>
        </div>

        <div className="menu-details">
          <h1>{menuData.name}</h1>
          <p className="menu-description">{menuData.description}</p>

          {menuData.items.length > 0 ? (
            <div className="menu-items">
              <h2>Itens do Cardápio</h2>
              <div className="items-grid">
                {menuData.items.map((item) => (
                  <div key={item.id} className="menu-item-card">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="item-image" />
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-price">
                      A partir de R$ {item.price.toFixed(2)}
                    </div>
                    <div className="item-category">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-menu">
              <p>Este cardápio ainda não possui itens cadastrados.</p>
              <p>Adicione pratos e bebidas ao cardápio para que os clientes possam visualizá-los.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

