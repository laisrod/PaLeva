import { Link } from 'react-router-dom'
import { useManageMenuItemPortions } from '../../hooks/Menu/useManageMenuItemPortions'
import { ManageMenuItemPortionsProps } from '../../types/menu'
import '../../../../../css/owner/ManageMenuItemPortions.css'

export default function ManageMenuItemPortions({
  establishmentCode,
  menuId,
  menuItemId,
  productId,
  isDish,
  productName,
  onClose,
  onSuccess,
}: ManageMenuItemPortionsProps) {
  const {
    portions,
    selectedPortions,
    loading,
    saving,
    error,
    handlePortionToggle,
    handleSave,
  } = useManageMenuItemPortions({
    establishmentCode,
    menuId,
    menuItemId,
    productId,
    isDish,
    onSuccess: () => {
      onSuccess()
      onClose()
    },
  })

  return (
    <div className="manage-menu-item-portions-overlay" onClick={onClose}>
      <div className="manage-menu-item-portions-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="manage-menu-item-portions-title">
          Selecionar Porções - {productName}
        </h3>

        {error && (
          <div className="manage-menu-item-portions-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="manage-menu-item-portions-loading">Carregando porções...</div>
        ) : portions.length === 0 ? (
          <div className="manage-menu-item-portions-empty">
            <p>Nenhuma porção cadastrada para este item.</p>
            <p>Adicione porções ao item primeiro.</p>
            <button
              className="manage-menu-item-portions-close"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="manage-menu-item-portions-header">
              <Link
                to={isDish
                  ? `/establishment/${establishmentCode}/dishes/${productId}/portions`
                  : `/establishment/${establishmentCode}/drinks/${productId}/portions`
                }
                className="manage-menu-item-portions-link"
                onClick={(e) => e.stopPropagation()}
              >
                Gerenciar Porções Completo →
              </Link>
            </div>

            <div className="manage-menu-item-portions-list">
              {portions.map(portion => (
                <div
                  key={portion.id}
                  className={`manage-menu-item-portions-item ${selectedPortions.includes(portion.id) ? 'selected' : ''}`}
                >
                  <label className="manage-menu-item-portions-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPortions.includes(portion.id)}
                      onChange={() => handlePortionToggle(portion.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="manage-menu-item-portions-info">
                      <span className="manage-menu-item-portions-description">
                        {portion.description}
                      </span>
                    </div>
                  </label>
                  <div className="manage-menu-item-portions-actions">
                    <Link
                      to={isDish
                        ? `/establishment/${establishmentCode}/dishes/${productId}/portions/${portion.id}/edit`
                        : `/establishment/${establishmentCode}/drinks/${productId}/portions/${portion.id}/edit`
                      }
                      className="manage-menu-item-portions-edit-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="manage-menu-item-portions-add">
              <Link
                to={isDish
                  ? `/establishment/${establishmentCode}/dishes/${productId}/portions/new`
                  : `/establishment/${establishmentCode}/drinks/${productId}/portions/new`
                }
                className="manage-menu-item-portions-add-btn"
                onClick={(e) => e.stopPropagation()}
              >
                + Adicionar Nova Porção
              </Link>
            </div>

            <div className="manage-menu-item-portions-actions">
              <button
                className="manage-menu-item-portions-cancel"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="manage-menu-item-portions-save"
                onClick={handleSave}
                disabled={saving || selectedPortions.length === 0}
              >
                {saving ? 'Salvando...' : 'Salvar Porções'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
