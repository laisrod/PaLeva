import { useParams, Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import { useEditDish } from '../../hooks/Dish/useEditDish'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useDishPortions } from '../../hooks/DishPortion/useDishPortions'
import '../../../css/owner/CreateDish.css'

export default function EditDish() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const {
    formData,
    tags,
    errors,
    loading,
    loadingDish,
    loadingTags,
    handleChange,
    handleFileChange,
    handleTagToggle,
    handleCreateTag,
    handleSubmit,
    setFormData,
  } = useEditDish({ 
    dishId: id ? parseInt(id) : undefined,
    establishmentCode: code 
  })

  const dishId = id ? parseInt(id) : undefined
  const { portions, loading: loadingPortions } = useDishPortions(code, dishId)

  if (loadingDish) {
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
            <h1>Editar Prato</h1>
            <Link
              to={`/establishment/${code}/dishes`}
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
                placeholder="Ex: Pizza Margherita"
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
                placeholder="Descreva o prato..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="calories">Calorias</label>
              <input
                id="calories"
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleChange}
                placeholder="Ex: 350"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Preços (Porções)</label>
              {loadingPortions ? (
                <p>Carregando porções...</p>
              ) : portions.length > 0 ? (
                <div className="portions-list">
                  {portions.map(portion => (
                    <div key={portion.id} className="portion-item">
                      <div className="portion-info">
                        <span className="portion-description">{portion.description}</span>
                        <span className="portion-price">R$ {portion.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  ))}
                  <Link
                    to={`/establishment/${code}/dishes/${id}/portions`}
                    className="btn-manage-portions"
                  >
                    Gerenciar Porções →
                  </Link>
                </div>
              ) : (
                <div className="portions-empty">
                  <p>Nenhuma porção cadastrada</p>
                  <Link
                    to={`/establishment/${code}/dishes/${id}/portions/new`}
                    className="btn-add-portion"
                  >
                    ➕ Adicionar Porção
                  </Link>
                </div>
              )}
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

            <div className="form-group">
              <label>Características</label>
              {loadingTags ? (
                <p>Carregando características...</p>
              ) : (
                <>
                  <div className="tags-grid">
                    {tags.map((tag) => (
                      <label key={tag.id} className="tag-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.selectedTags.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          disabled={loading}
                        />
                        <span>{tag.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="new-tag-section">
                    <input
                      type="text"
                      name="newTagName"
                      value={formData.newTagName}
                      onChange={handleChange}
                      placeholder="Nova característica"
                      disabled={loading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleCreateTag()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCreateTag}
                      className="btn-add-tag"
                      disabled={loading || !formData.newTagName.trim()}
                    >
                      Adicionar
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${code}/dishes`}
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
