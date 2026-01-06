import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../shared/services/api'
import { useAuth } from '../../shared/hooks/useAuth'
import '../../css/owner/pages/CreateEstablishment.css'

export default function CreateEstablishment() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    social_name: '',
    cnpj: '',
    full_address: '',
    city: '',
    state: '',
    postal_code: '',
    email: '',
    phone_number: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    // Verificar se já tem estabelecimento
    const checkAuth = async () => {
      try {
        const response = await api.isSignedIn()
        if (response.data?.signed_in && response.data?.user?.establishment) {
          // Já tem estabelecimento, redirecionar para gestão
          navigate(`/establishment/${response.data.user.establishment.code}/menus`)
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
      }
    }

    checkAuth()
  }, [navigate])

  // Formatação de CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return value
  }

  // Formatação de CEP: 00000-000
  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  // Formatação de telefone: (00) 00000-0000
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    return value
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value)
    } else if (name === 'postal_code') {
      formattedValue = formatCEP(value)
    } else if (name === 'phone_number') {
      formattedValue = formatPhone(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
    // Limpar erros quando o usuário começar a digitar
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!formData.name.trim()) newErrors.push('Nome Fantasia é obrigatório')
    if (!formData.social_name.trim()) newErrors.push('Razão Social é obrigatória')
    if (!formData.cnpj.trim()) {
      newErrors.push('CNPJ é obrigatório')
    } else {
      const cnpjNumbers = formData.cnpj.replace(/\D/g, '')
      if (cnpjNumbers.length !== 14) {
        newErrors.push('CNPJ deve conter 14 dígitos')
      }
    }
    if (!formData.full_address.trim()) newErrors.push('Endereço é obrigatório')
    if (!formData.city.trim()) newErrors.push('Cidade é obrigatória')
    if (!formData.state.trim()) {
      newErrors.push('Estado é obrigatório')
    } else if (formData.state.length !== 2) {
      newErrors.push('Estado deve ter 2 caracteres (ex: SP, RJ)')
    }
    if (!formData.postal_code.trim()) {
      newErrors.push('CEP é obrigatório')
    } else {
      const cepNumbers = formData.postal_code.replace(/\D/g, '')
      if (cepNumbers.length !== 8) {
        newErrors.push('CEP deve conter 8 dígitos')
      }
    }
    if (!formData.email.trim()) {
      newErrors.push('E-mail é obrigatório')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('E-mail inválido')
    }
    if (!formData.phone_number.trim()) {
      newErrors.push('Telefone é obrigatório')
    } else {
      const phoneNumbers = formData.phone_number.replace(/\D/g, '')
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.push('Telefone inválido')
      }
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

    setLoading(true)

    try {
      // Limpar formatação antes de enviar
      const establishmentData = {
        name: formData.name.trim(),
        social_name: formData.social_name.trim(),
        cnpj: formData.cnpj.replace(/\D/g, ''),
        full_address: formData.full_address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        postal_code: formData.postal_code.replace(/\D/g, ''),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.replace(/\D/g, ''),
      }

      const response = await api.createEstablishment(establishmentData)

      if (response.error || response.errors) {
        // Priorizar o array de erros se existir
        if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
          setErrors(response.errors)
        } else if (Array.isArray(response.error)) {
          setErrors(response.error)
        } else if (response.error) {
          setErrors([response.error])
        } else {
          setErrors(['Erro ao criar estabelecimento'])
        }
      } else if (response.data) {
        // Sucesso! Salvar código do estabelecimento
        const establishmentCode = response.data.establishment.code
        
        // Sincronizar dados do usuário com backend (role será atualizado automaticamente)
        await refreshUser()

        // Redirecionar para a página de gestão
        navigate(`/establishment/${establishmentCode}/menus`)
      }
    } catch (err) {
      setErrors(['Erro ao criar estabelecimento. Tente novamente.'])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-establishment-container">
      <div className="create-establishment-card">
        <h1>PaLeva</h1>
        <h2>Novo Restaurante</h2>

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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome Fantasia *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Restaurante do João"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="social_name">Razão Social *</label>
              <input
                id="social_name"
                name="social_name"
                type="text"
                value={formData.social_name}
                onChange={handleChange}
                placeholder="Ex: João Restaurante LTDA"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="full_address">Endereço *</label>
              <input
                id="full_address"
                name="full_address"
                type="text"
                value={formData.full_address}
                onChange={handleChange}
                placeholder="Rua, número, complemento"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Cidade *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="São Paulo"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">Estado *</label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postal_code">CEP *</label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                placeholder="00000-000"
                maxLength={9}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@restaurante.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Telefone *</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Restaurante'}
          </button>
        </form>
      </div>
    </div>
  )
}

