import { Link, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useCreateTag } from '../../hooks/Tags/useCreateTag'
import { TagCategory } from '../../types/tag'
import '../../../css/owner/CreateMenu.css'

export default function CreateTag() {
  const { code } = useParams<{ code: string }>()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') as TagCategory | null
  const category: TagCategory = categoryParam === 'drink' ? 'drink' : 'dish'

  const {
    establishmentCode,
    name,
    loading,
    errors,
    handleChange,
    handleSubmit,
  } = useCreateTag(code, category)

  const title = category === 'drink'
    ? 'Nova característica de Bebida'
    : 'Nova característica de Prato'

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>{title}</h1>
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
