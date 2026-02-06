import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import { useCreateDishPage } from '../../hooks/Dish/useCreateDishPage'
import '../../../../../css/owner/CreateDish.css'

export default function CreateDish() {
  const {
    establishmentCode,
    formData,
    tags,
    errors,
    loading,
    loadingTags,
    handleChange,
    handleFileChange,
    handleTagToggle,
    handleCreateTag,
    handleSubmit,
  } = useCreateDishPage()

  return (
    <Layout>
      <div className="create-dish-container">
        <div className="create-dish-card">
          <div className="dish-header">
            <h1>Cadastrar Prato</h1>
            <Link
              to={`/establishment/${establishmentCode}/dishes`}
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
              <div className="form-group-label-row">
                <label>Características</label>
                <Link
                  to={`/establishment/${establishmentCode}/tags?category=dish`}
                  className="link-edit-tags"
                >
                  Editar características
                </Link>
              </div>
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
                        <span>  {tag.name}</span>
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
                to={`/establishment/${establishmentCode}/dishes`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

