import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useEditMenu } from '../hooks/useEditMenu'
import '../../css/owner/pages/CreateMenu.css'

export default function EditMenu() {
  const { code, id } = useParams<{ code: string; id: string }>()

  const {
    formData,
    errors,
    loading,
    loadingMenu,
    handleChange,
    handleSubmit,
  } = useEditMenu({ 
    menuId: id ? parseInt(id) : undefined,
    establishmentCode: code 
  })

  if (loadingMenu) {
    return (
      <Layout>
        <div className="create-menu-container">
          <div className="create-menu-card">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>Editar Cardápio</h1>
            <Link
              to={`/establishment/${code}/menus`}
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
                to={`/establishment/${code}/menus`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

