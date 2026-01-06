import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/CreateDish.css'

export default function CreateDrink() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    alcoholic: false,
    calories: '',
    photo: null as File | null,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }
  }, [navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      const drinkData: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        alcoholic: formData.alcoholic,
      }

      if (formData.calories) {
        drinkData.calories = parseInt(formData.calories)
      }

      if (formData.photo) {
        drinkData.photo = formData.photo
      }

      const response = await api.createDrink(code, drinkData)

      if (response.error || response.errors) {
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          setErrors(response.errors)
        } else if (Array.isArray(response.error)) {
          setErrors(response.error)
        } else if (response.error) {
          setErrors([response.error])
        } else {
          setErrors(['Erro ao criar bebida'])
        }
      } else if (response.data) {
        // Sucesso! Redirecionar para a lista de bebidas
        navigate(`/establishment/${code}/drinks`)
      }
    } catch (err) {
      setErrors(['Erro ao criar bebida. Tente novamente.'])
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
            <h1>Nova Bebida</h1>
            <Link
              to={`/establishment/${code}/drinks`}
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
                {loading ? 'Salvando...' : 'Criar Bebida'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

