import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useEditDrink } from '../../hooks/Drink/useEditDrink'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import '../../../css/owner/pages/CreateDish.css'

export default function EditDrink() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const {
    formData,
    errors,
    loading,
    loadingDrink,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useEditDrink({ 
    drinkId: id ? parseInt(id) : undefined,
    establishmentCode: code 
  })

  if (loadingDrink) {
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
            <h1>Editar Bebida</h1>
            <Link
              to={`/establishment/${code}/drinks`}
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
                placeholder="Ex: Coca-Cola"
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
                placeholder="Descreva a bebida..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="alcoholic"
                  checked={formData.alcoholic}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Alcoólica?</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="calories">Calorias</label>
              <input
                id="calories"
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleChange}
                placeholder="Ex: 150"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photo">Foto</label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              {formData.photo && (
                <p className="file-name">{formData.photo.name}</p>
              )}
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${code}/drinks`}
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
