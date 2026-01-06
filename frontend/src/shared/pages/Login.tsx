import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { isOwner } from '../utils/auth'
import '../../css/shared/Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      // Limpar a mensagem após 5 segundos
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authLogin(email, password)
      
      if (!result.success) {
        const errorMessage = Array.isArray(result.error) 
          ? result.error.join(', ') 
          : result.error || 'Erro ao fazer login. Tente novamente.'
        setError(errorMessage)
        return
      }

      // Usar hook useAuth que já sincroniza com backend
      const user = result.user
      
      if (!user) {
        setError('Erro ao obter dados do usuário.')
        return
      }

      // Redirecionar baseado no role (sempre boolean agora)
      const userIsOwner = isOwner(user.role)
      const establishmentCode = user.establishment?.code

      // PRIORIDADE 1: Proprietário
      if (userIsOwner) {
        if (establishmentCode) {
          navigate(`/establishment/${establishmentCode}/menus`)
        } else {
          navigate('/establishments/new')
        }
        return
      }

      // PRIORIDADE 2: Cliente
      if (establishmentCode) {
        navigate(`/menu/${establishmentCode}`)
      } else {
        navigate('/restaurants')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearStorage = () => {
    localStorage.clear()
    alert('LocalStorage limpo! Recarregue a página.')
    window.location.reload()
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>PaLeva</h1>
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="login-footer">
            <p>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </form>

        {/* Botão temporário para desenvolvimento - REMOVER EM PRODUÇÃO */}
        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '2px dashed #dc3545',
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#856404', fontWeight: 'bold' }}>
            🔧 DEV TOOLS
          </p>
          <button
            type="button"
            onClick={handleClearStorage}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#dc3545',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            title="Limpar localStorage (apenas desenvolvimento)"
          >
            🗑️ Limpar LocalStorage
          </button>
        </div>
      </div>
    </div>
  )
}

