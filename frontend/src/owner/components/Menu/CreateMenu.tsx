import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useCreateMenuPage } from '../../hooks/Menu/useCreateMenuPage'
import '../../../css/owner/CreateMenu.css'

export default function CreateMenu() {
  const {
    establishmentCode,
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useCreateMenuPage()

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>Novo Cardápio</h1>
            <Link
              to={`/establishment/${establishmentCode}/menus`}
              className="btn-back"
            >
              ← Voltar
            </Link>
          </div>

          {errors.length > 0 && (
            <div className="error-message">
              <h3>{errors.length === 1 ? 'Erro' : `${errors.length} erros`} impediram o cadastro:</h3>
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

            <div className="form-actions">
              <Link
                to={`/establishment/${establishmentCode}/menus`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Cardápio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

