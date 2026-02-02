import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useEditMenuPage } from '../../hooks/Menu/useEditMenuPage'
import { useMenuItems } from '../../hooks/Menu/useMenuItems'
import { useMenuItemsManagement } from '../../hooks/Menu/useMenuItemsManagement'
import AddMenuItems from './AddMenuItems'
import ManageMenuItemPortions from './ManageMenuItemPortions'
import EditMenuLoading from './EditMenuLoading'
import '../../../css/owner/CreateMenu.css'
import '../../../css/owner/ViewMenu.css'

export default function EditMenu() {
  const {
    establishmentCode,
    menuId,
    formData,
    errors,
    loading,
    loadingMenu,
    handleChange,
    handleSubmit,
  } = useEditMenuPage()

  const menuIdNumber = menuId ? parseInt(menuId) : undefined
  const { menuItems, loading: loadingItems, refetch: refetchItems } = useMenuItems({
    menuId: menuIdNumber,
    establishmentCode,
  })

  const { removeMenuItem, loading: removingItem } = useMenuItemsManagement({
    establishmentCode,
    menuId: menuIdNumber,
    onSuccess: refetchItems,
  })

  const [managingPortions, setManagingPortions] = useState<{
    menuItemId: number
    productId: number
    isDish: boolean
    productName: string
  } | null>(null)

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('Tem certeza que deseja remover este item do cardápio?')) {
      await removeMenuItem(itemId)
    }
  }

  const handleManagePortions = (item: any) => {
    const product = item.dish || item.drink
    if (!product) return

    const productId = item.dish?.id || item.drink?.id
    const isDish = !!item.dish

    setManagingPortions({
      menuItemId: item.id,
      productId: productId!,
      isDish,
      productName: product.name,
    })
  }

  if (loadingMenu) {
    return <EditMenuLoading />
  }

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>Editar Cardápio</h1>
            <Link
              to={`/establishment/${establishmentCode}/menus`}
              className="btn-back"
            >
              ← Voltar
            </Link>
          </div>

          {errors.length > 0 && (
            <div className="error-message">
              <h3>{errors.length === 1 ? 'Erro' : `${errors.length} erros`} impediram a atualização:</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Cardápio Principal"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o cardápio..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Preço</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 25.50"
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${establishmentCode}/menus`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>

          {menuIdNumber && (
            <div className="menu-items-section">
              {loadingItems ? (
                <div className="menu-items-loading">Carregando itens...</div>
              ) : menuItems.length > 0 ? (
                <div className="menu-items-current">
                  <h3 className="menu-items-current-title">Itens Atuais do Cardápio</h3>
                  <div className="items-grid">
                    {menuItems.map((item) => {
                      const product = item.dish || item.drink
                      if (!product) return null

                      const portions = product.portions || []
                      const productId = item.dish?.id || item.drink?.id
                      const isDish = !!item.dish
                      const portionsPath = isDish
                        ? `/establishment/${establishmentCode}/dishes/${productId}/portions`
                        : `/establishment/${establishmentCode}/drinks/${productId}/portions`

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
                              <h4 className="menu-item-card-name">{product.name}</h4>
                              <div className="item-category">
                                {isDish ? 'Prato' : 'Bebida'}
                              </div>
                            </div>
                            
                            {product.description && (
                              <p className="menu-item-card-description">{product.description}</p>
                            )}

                            {portions.length > 0 ? (
                              <div className="menu-item-portions-section">
                                <h5 className="portions-title">Porções Disponíveis:</h5>
                                <div className="portions-list">
                                  {portions.map((portion) => (
                                    <div key={portion.id} className="portion-item">
                                      <span className="portion-description">
                                        {portion.description}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => handleManagePortions(item)}
                                  className="btn-manage-portions"
                                >
                                  Gerenciar Porções →
                                </button>
                              </div>
                            ) : (
                              <div className="no-portions">
                                <p>Nenhuma porção selecionada</p>
                                <button
                                  onClick={() => handleManagePortions(item)}
                                  className="btn-add-portion"
                                >
                                  Selecionar Porções
                                </button>
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
                <div className="menu-items-empty">
                  <p>Nenhum item no cardápio ainda.</p>
                </div>
              )}

              <AddMenuItems
                establishmentCode={establishmentCode}
                menuId={menuIdNumber}
                onItemAdded={refetchItems}
                existingItems={menuItems}
              />
            </div>
          )}

          {managingPortions && (
            <ManageMenuItemPortions
              establishmentCode={establishmentCode}
              menuId={menuIdNumber!}
              menuItemId={managingPortions.menuItemId}
              productId={managingPortions.productId}
              isDish={managingPortions.isDish}
              productName={managingPortions.productName}
              onClose={() => setManagingPortions(null)}
              onSuccess={refetchItems}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

