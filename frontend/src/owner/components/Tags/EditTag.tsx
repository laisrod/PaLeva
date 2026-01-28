import { Link, useParams } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useEditTag } from '../../hooks/Tags/useEditTag'
import '../../../css/owner/CreateMenu.css'

export default function EditTag() {
  const { code, id } = useParams<{ code: string; id: string }>()
  const {
    establishmentCode,
    name,
    loading,
    loadingTag,
    errors,
    handleChange,
    handleSubmit,
  } = useEditTag(code, id)

  if (loadingTag) {
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
            <h1>Editar característica</h1>
            <Link
              to={`/establishment/${establishmentCode}/tags`}
              className="btn-back"
            >
              ← Voltar
            </Link>
          </div>

          {errors.length > 0 && (
            <div className="error-message">
              <h3>{errors.length === 1 ? 'Erro' : `${errors.length} erros`}:</h3>
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
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
                value={name}
                onChange={handleChange}
                placeholder="Ex: Apimentado"
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${establishmentCode}/tags`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
