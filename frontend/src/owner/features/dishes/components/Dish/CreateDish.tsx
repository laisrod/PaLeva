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
    // Porções
    createdDishId,
    portions,
    loadingPortions,
    portionFormData,
    portionErrors,
    creatingPortion,
    handlePortionChange,
    handlePortionSubmit,
    editingPortionId,
    editPortionFormData,
    editPortionErrors,
    updatingPortion,
    startEditPortion,
    cancelEditPortion,
    handleEditPortionSubmit,
    deletePortion,
    deletingPortion,
    setEditPortionFormData,
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

          {/* Seção de Porções - aparece após criar o prato */}
          {createdDishId && (
            <div className="portions-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
              <h2 style={{ marginBottom: '1rem' }}>Gerenciar Porções</h2>
              
              {/* Formulário de criação de porção */}
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Adicionar Nova Porção</h3>
                {portionErrors.length > 0 && (
                  <div className="error-message">
                    <ul>
                      {portionErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <form onSubmit={handlePortionSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="portion-description">Descrição *</label>
                    <input
                      id="portion-description"
                      name="description"
                      type="text"
                      value={portionFormData.description}
                      onChange={handlePortionChange}
                      placeholder="Ex: Pequeno, Médio, Grande"
                      required
                      disabled={creatingPortion}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="portion-price">Preço *</label>
                    <input
                      id="portion-price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={portionFormData.price}
                      onChange={handlePortionChange}
                      placeholder="Ex: 25.50"
                      required
                      disabled={creatingPortion}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={creatingPortion} style={{ marginBottom: 0 }}>
                    {creatingPortion ? 'Salvando...' : 'Adicionar'}
                  </button>
                </form>
              </div>

              {/* Lista de porções existentes */}
              <div className="form-group">
                <h3 style={{ marginBottom: '1rem' }}>Porções Cadastradas</h3>
                {loadingPortions ? (
                  <p>Carregando porções...</p>
                ) : portions.length > 0 ? (
                  <div className="portions-list">
                    {portions.map(portion => (
                      <div key={portion.id} className="portion-item" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem',
                        marginBottom: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}>
                        {editingPortionId === portion.id ? (
                          // Modo de edição
                          <form onSubmit={handleEditPortionSubmit} style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            {editPortionErrors.length > 0 && (
                              <div className="error-message" style={{ width: '100%', marginBottom: '0.5rem' }}>
                                <ul>
                                  {editPortionErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="form-group" style={{ flex: 1 }}>
                              <label htmlFor={`edit-description-${portion.id}`}>Descrição *</label>
                              <input
                                id={`edit-description-${portion.id}`}
                                type="text"
                                value={editPortionFormData.description}
                                onChange={(e) => setEditPortionFormData({ ...editPortionFormData, description: e.target.value })}
                                required
                                disabled={updatingPortion}
                              />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label htmlFor={`edit-price-${portion.id}`}>Preço *</label>
                              <input
                                id={`edit-price-${portion.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={editPortionFormData.price}
                                onChange={(e) => setEditPortionFormData({ ...editPortionFormData, price: e.target.value })}
                                required
                                disabled={updatingPortion}
                              />
                            </div>
                            <button type="submit" className="btn-primary" disabled={updatingPortion} style={{ marginBottom: 0 }}>
                              {updatingPortion ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button 
                              type="button" 
                              onClick={cancelEditPortion} 
                              className="btn-secondary" 
                              disabled={updatingPortion}
                              style={{ marginBottom: 0 }}
                            >
                              Cancelar
                            </button>
                          </form>
                        ) : (
                          // Modo de visualização
                          <>
                            <div className="portion-info" style={{ flex: 1 }}>
                              <span className="portion-description" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
                                {portion.description}
                              </span>
                              <span className="portion-price" style={{ color: '#666' }}>
                                R$ {portion.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => startEditPortion(portion.id)}
                                className="btn-secondary"
                                disabled={deletingPortion}
                                style={{ marginBottom: 0 }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Tem certeza que deseja remover esta porção?')) {
                                    await deletePortion(portion.id)
                                  }
                                }}
                                className="btn-secondary"
                                disabled={deletingPortion}
                                style={{ marginBottom: 0, backgroundColor: '#dc3545', color: 'white', borderColor: '#dc3545' }}
                              >
                                {deletingPortion ? 'Removendo...' : 'Remover'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="portions-empty">
                    <p>Nenhuma porção cadastrada. Adicione uma porção acima.</p>
                  </div>
                )}
              </div>

              {/* Botão para finalizar */}
              <div className="form-actions" style={{ marginTop: '2rem' }}>
                <Link
                  to={`/establishment/${establishmentCode}/dishes`}
                  className="btn-primary"
                >
                  Finalizar e Voltar para Pratos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

