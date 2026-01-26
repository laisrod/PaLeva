import { useParams, Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useEditDishPortion } from '../../hooks/DishPortion/useEditDishPortion'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import '../../../css/owner/CreateDish.css'

export default function EditDishPortion() {
  const { code, id, portionId } = useParams<{ code: string; id: string; portionId: string }>()
  useRequireAuth()

  const dishId = id ? parseInt(id) : undefined
  const {
    formData,
    errors,
    loading,
    loadingPortion,
    handleChange,
    handleSubmit,
  } = useEditDishPortion({ 
    establishmentCode: code,
    dishId: dishId,
    portionId: portionId ? parseInt(portionId) : undefined
  })

  if (loadingPortion) {
    return (
      <Layout>
        <div className="create-dish-container">
          <div className="create-dish-card">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="create-dish-container">
        <div className="create-dish-card">
          <div className="dish-header">
            <h1>Editar Porção</h1>
            <Link
              to={`/establishment/${code}/dishes/${id}/portions`}
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
              <label htmlFor="description">Descrição *</label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ex: Pequeno, Médio, Grande"
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
                placeholder="Ex: 25.50"
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${code}/dishes/${id}/portions`}
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
