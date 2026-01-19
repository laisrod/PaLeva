import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { firebaseAuth } from '../services/firebaseAuth'
import { api } from '../services/api'
import '../../css/shared/Register.css'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    cpf: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '')
    
    // Aplica a formatação
    if (cpf.length <= 11) {
      return cpf
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      return false
    }
    if (!formData.last_name.trim()) {
      setError('Sobrenome é obrigatório')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório')
      return false
    }
    if (!formData.cpf.trim()) {
      setError('CPF é obrigatório')
      return false
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.password_confirmation) {
      setError('As senhas não coincidem')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 1. Criar usuário no Firebase
      const displayName = `${formData.name} ${formData.last_name}`.trim()
      const firebaseResult = await firebaseAuth.signUp(
        formData.email,
        formData.password,
        displayName
      )
      
      if (!firebaseResult.success || !firebaseResult.user) {
        setError(firebaseResult.error || 'Erro ao criar conta no Firebase')
        setLoading(false)
        return
      }

      // Aguardar um pouco para garantir que o token está disponível
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Obter o token do Firebase (forçar refresh para garantir que está atualizado)
      const firebaseToken = await firebaseAuth.getIdTokenForceRefresh()
      if (!firebaseToken) {
        setError('Erro ao obter token do Firebase. Tente fazer login após criar a conta.')
        setLoading(false)
        return
      }
      
      console.log('Token obtido do Firebase:', firebaseToken.substring(0, 20) + '...')

      // 2. Criar usuário no backend Rails com dados adicionais
      // O backend validará o token do Firebase
      const response = await api.signUp({
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        cpf: formData.cpf,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })
      
      if (response.error) {
        // Se falhar no backend, fazer logout do Firebase
        await firebaseAuth.signOut()
        
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error
        setError(errorMessage)
      } else if (response.data) {
        // Cadastro bem-sucedido - usuário já está autenticado no Firebase
        navigate('/login', { 
          state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' }
        })
      }
    } catch (err) {
      // Em caso de erro, fazer logout do Firebase
      await firebaseAuth.signOut()
      setError('Erro ao realizar cadastro. Tente novamente.')
      console.error('Erro no registro:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>PaLeva</h1>
        <h2>Criar Conta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Sobrenome</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Seu sobrenome"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              value={formData.cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              maxLength={14}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmar Senha</label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>

          <div className="register-footer">
            <p>
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

