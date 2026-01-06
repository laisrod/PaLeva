import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/CreateDish.css'

interface Tag {
  id: number
  name: string
}

export default function CreateDish() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    photo: null as File | null,
    selectedTags: [] as number[],
    newTagName: '',
  })
  const [tags, setTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    loadTags()
  }, [navigate])

  const loadTags = async () => {
    setLoadingTags(true)
    try {
      const response = await api.getTags()
      if (response.data) {
        setTags(response.data)
      }
    } catch (err) {
      console.error('Erro ao carregar características:', err)
    } finally {
      setLoadingTags(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }))
  }

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedTags.includes(tagId)
      return {
        ...prev,
        selectedTags: isSelected
          ? prev.selectedTags.filter((id) => id !== tagId)
          : [...prev.selectedTags, tagId],
      }
    })
  }

  const handleCreateTag = async () => {
    if (!formData.newTagName.trim()) return

    try {
      const response = await api.createTag(formData.newTagName.trim())
      if (response.data) {
        // Adicionar a nova tag à lista e selecioná-la
        const newTag = response.data.tag
        setTags((prev) => [...prev, newTag])
        setFormData((prev) => ({
          ...prev,
          selectedTags: [...prev.selectedTags, newTag.id],
          newTagName: '',
        }))
      } else if (response.error) {
        setErrors([response.error])
      }
    } catch (err) {
      console.error('Erro ao criar característica:', err)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!formData.name.trim()) {
      newErrors.push('Nome é obrigatório')
    }
    if (!formData.description.trim()) {
      newErrors.push('Descrição é obrigatória')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!validateForm()) {
      return
    }

    if (!code) {
      setErrors(['Código do estabelecimento não encontrado'])
      return
    }

    setLoading(true)

    try {
      const dishData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      }

      if (formData.calories) {
        dishData.calories = parseInt(formData.calories)
      }

      if (formData.photo) {
        dishData.photo = formData.photo
      }

      if (formData.selectedTags.length > 0) {
        dishData.tag_ids = formData.selectedTags
      }

      if (formData.newTagName.trim()) {
        dishData.tags_attributes = [{ name: formData.newTagName.trim() }]
      }

      const response = await api.createDish(code, dishData)

      if (response.error || response.errors) {
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          setErrors(response.errors)
        } else if (Array.isArray(response.error)) {
          setErrors(response.error)
        } else if (response.error) {
          setErrors([response.error])
        } else {
          setErrors(['Erro ao criar prato'])
        }
      } else if (response.data) {
        // Sucesso! Redirecionar para a lista de pratos
        navigate(`/establishment/${code}/dishes`)
      }
    } catch (err) {
      setErrors(['Erro ao criar prato. Tente novamente.'])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="create-dish-container">
        <div className="create-dish-card">
          <div className="dish-header">
            <h1>Cadastrar Prato</h1>
            <Link
              to={`/establishment/${code}/dishes`}
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
                      value={formData.newTagName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newTagName: e.target.value,
                        }))
                      }
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
                {loading ? 'Salvando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

