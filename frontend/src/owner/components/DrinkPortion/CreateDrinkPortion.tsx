import { useParams, Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useCreateDrinkPortion } from '../../hooks/DrinkPortion/useCreateDrinkPortion'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import '../../../css/owner/CreateDish.css'

export default function CreateDrinkPortion() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const drinkId = id ? parseInt(id) : undefined
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useCreateDrinkPortion({ 
    establishmentCode: code,
    drinkId: drinkId
  })

  return (
    <Layout>
      <div className="create-dish-container">
        <div className="create-dish-card">
          <div className="dish-header">
            <h1>Nova Porção</h1>
            <Link
              to={`/establishment/${code}/drinks/${id}/portions`}
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
              <label htmlFor="description">Descrição *</label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: 300ml, 500ml, 1L"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Preço *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 5.50"
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${code}/drinks/${id}/portions`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Criar Porção'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
