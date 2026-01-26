import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useEditDrink } from '../../hooks/Drink/useEditDrink'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useDrinkPortions } from '../../hooks/DrinkPortion/useDrinkPortions'
import '../../../css/owner/pages/CreateDish.css'

export default function EditDrink() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const {
    formData,
    tags,
    errors,
    loading,
    loadingDrink,
    loadingTags,
    handleChange,
    handleFileChange,
    handleTagToggle,
    handleCreateTag,
    handleSubmit,
    drink,
  } = useEditDrink({ 
    drinkId: id ? parseInt(id) : undefined,
    establishmentCode: code 
  })

  const drinkId = id ? parseInt(id) : undefined
  const { portions, loading: loadingPortions } = useDrinkPortions(code, drinkId)

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
                    to={`/establishment/${code}/drinks/${id}/portions`}
                    className="btn-manage-portions"
                  >
                    Gerenciar Porções →
                  </Link>
                </div>
              ) : (
                <div className="portions-empty">
                  <p>Nenhuma porção cadastrada</p>
                  <Link
                    to={`/establishment/${code}/drinks/${id}/portions/new`}
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
                <div className="photo-preview">
                  <p className="file-name">Nova foto: {formData.photo.name}</p>
                  <img 
                    src={URL.createObjectURL(formData.photo)} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px', borderRadius: '8px' }}
                  />
                </div>
              )}
              {!formData.photo && drink?.photo_url && (
                <div className="current-photo">
                  <p>Foto atual:</p>
                  <img 
                    key={`${drink.id}-${drink.photo_url}`}
                    src={drink.photo_url} 
                    alt={drink.name} 
                    style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px', borderRadius: '8px' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Características</label>
              {loadingTags ? (
                <p>Carregando características...</p>
              ) : (
                <>
                  <div className="tags-grid">
                    {tags.map((tag: { id: number; name: string }) => (
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
