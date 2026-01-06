import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/CreateMenu.css'

export default function CreateMenu() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors.length > 0) {
      setErrors([])
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
      const response = await api.createMenu(code, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      })

      if (response.error || response.errors) {
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          setErrors(response.errors)
        } else if (Array.isArray(response.error)) {
          setErrors(response.error)
        } else if (response.error) {
          setErrors([response.error])
        } else {
          setErrors(['Erro ao criar cardápio'])
        }
      } else if (response.data) {
        // Sucesso! Redirecionar para a lista de menus
        navigate(`/establishment/${code}/menus`)
      }
    } catch (err) {
      setErrors(['Erro ao criar cardápio. Tente novamente.'])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>Novo Cardápio</h1>
            <Link
              to={`/establishment/${code}/menus`}
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
                placeholder="Ex: Cardápio Principal"
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
                placeholder="Descreva o cardápio..."
                rows={4}
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${code}/menus`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Cardápio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

