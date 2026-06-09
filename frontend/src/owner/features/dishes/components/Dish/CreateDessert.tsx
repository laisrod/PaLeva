import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import { useCreateDessertPage } from '../../hooks/Dish/useCreateDessertPage'
import '../../../../../css/owner/CreateDish.css'

export default function CreateDessert() {
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
  } = useCreateDessertPage()

  const backPath = `/establishment/${establishmentCode}/desserts`

  return (
    <Layout>
      <div className="create-dish-container">
        <div className="create-dish-card">
          <div className="dish-header">
            <h1>🍰 Cadastrar Sobremesa</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link to={backPath} className="btn-back">← Voltar</Link>
              <button
                type="submit"
                form="dessert-form"
                className="btn-primary"
                disabled={loading}
                style={{ margin: 0 }}
              >
                {loading ? 'Salvando...' : 'Salvar Sobremesa'}
              </button>
            </div>
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

          <form id="dessert-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Pudim de Leite"
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
                placeholder="Descreva a sobremesa..."
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
                placeholder="Ex: 280"
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
                      onKeyDown={(e) => {
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
              <Link to={backPath} className="btn-secondary">Cancelar</Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Sobremesa'}
              </button>
            </div>
          </form>

          {/* Seção de Porções — aparece após criar a sobremesa */}
          {createdDishId && (
            <div className="portions-section" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-gray-200)' }}>
              <h2 style={{ marginBottom: '1rem' }}>Gerenciar Porções</h2>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Adicionar Nova Porção</h3>
                {portionErrors.length > 0 && (
                  <div className="error-message">
                    <ul>{portionErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
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
                      placeholder="Ex: Individual, Família"
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
                      placeholder="Ex: 18.00"
                      required
                      disabled={creatingPortion}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={creatingPortion} style={{ marginBottom: 0 }}>
                    {creatingPortion ? 'Salvando...' : 'Adicionar'}
                  </button>
                </form>
              </div>

              <div className="form-group">
                <h3 style={{ marginBottom: '1rem' }}>Porções Cadastradas</h3>
                {loadingPortions ? (
                  <p>Carregando porções...</p>
                ) : portions.length > 0 ? (
                  <div className="portions-list">
                    {portions.map(portion => (
                      <div key={portion.id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '1rem', marginBottom: '0.5rem',
                        border: '1px solid var(--color-gray-200)', borderRadius: '8px',
                        background: 'var(--color-white)',
                      }}>
                        {editingPortionId === portion.id ? (
                          <form onSubmit={handleEditPortionSubmit} style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            {editPortionErrors.length > 0 && (
                              <div className="error-message" style={{ width: '100%' }}>
                                <ul>{editPortionErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                              </div>
                            )}
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Descrição *</label>
                              <input
                                type="text"
                                value={editPortionFormData.description}
                                onChange={(e) => setEditPortionFormData({ ...editPortionFormData, description: e.target.value })}
                                required
                                disabled={updatingPortion}
                              />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>Preço *</label>
                              <input
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
                            <button type="button" onClick={cancelEditPortion} className="btn-secondary" disabled={updatingPortion} style={{ marginBottom: 0 }}>
                              Cancelar
                            </button>
                          </form>
                        ) : (
                          <>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 'bold', display: 'block' }}>{portion.description}</span>
                              <span style={{ color: 'var(--color-primary)' }}>R$ {portion.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => startEditPortion(portion.id)} className="btn-secondary" disabled={deletingPortion} style={{ marginBottom: 0 }}>
                                Editar
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Remover esta porção?')) await deletePortion(portion.id)
                                }}
                                className="btn-secondary"
                                disabled={deletingPortion}
                                style={{ marginBottom: 0, background: '#dc2626', color: 'white', borderColor: '#dc2626' }}
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
                  <p style={{ color: 'var(--text-muted)' }}>Nenhuma porção cadastrada.</p>
                )}
              </div>

              <div className="form-actions" style={{ marginTop: '2rem' }}>
                <Link to={backPath} className="btn-primary">
                  Finalizar e Voltar para Sobremesas
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
