import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useViewMenu } from '../../hooks/Menu/useViewMenu'
import ViewMenuLoading from './ViewMenuLoading'
import '../../../css/owner/ViewMenu.css'

export default function ViewMenu() {
  const {
    establishmentCode,
    menuId,
    menuData,
    loading,
    error,
    menuItems,
    loadingItems,
    removingItem,
    handleRemoveItem,
  } = useViewMenu()

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
          {menuData.price !== undefined && menuData.price !== null && typeof menuData.price === 'number' && (
            <p className="menu-price">Preço: R$ {Number(menuData.price).toFixed(2)}</p>
          )}

          {loadingItems ? (
            <div className="menu-items-loading">Carregando itens...</div>
          ) : menuItems.length > 0 ? (
            <div className="menu-items">
              <h2>Itens do Cardápio</h2>
              <div className="items-grid">
                {menuItems.map((item) => {
                  const product = item.dish || item.drink
                  if (!product) return null

                  const portions = product.portions || []

                  return (
                    <div key={item.id} className="menu-item-card">
                      {product.photo_url ? (
                        <img 
                          src={product.photo_url} 
                          alt={product.name} 
                          className="item-image" 
                        />
                      ) : (
                        <div className="item-image-placeholder">
                          <span>Sem foto</span>
                        </div>
                      )}
                      
                      <div className="menu-item-content">
                        <div className="menu-item-header-info">
                          <h3>{product.name}</h3>
                          <div className="item-category">
                            {item.dish ? 'Prato' : 'Bebida'}
                          </div>
                        </div>
                        
                        {product.description && (
                          <p className="menu-item-description">{product.description}</p>
                        )}

                        {portions.length > 0 ? (
                          <div className="menu-item-portions-section">
                            <h4 className="portions-title">Porções Disponíveis:</h4>
                            <div className="portions-list">
                              {portions.map((portion) => (
                                <div key={portion.id} className="portion-item">
                                  <span className="portion-description">
                                    {portion.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="no-portions">
                            <p>Nenhuma porção cadastrada</p>
                          </div>
                        )}

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="remove-item-btn"
                          disabled={removingItem}
                        >
                          {removingItem ? 'Removendo...' : 'Remover do Cardápio'}
                        </button>
                      </div>
                    </div>
                  )
                })}
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

