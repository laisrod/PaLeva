import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import '../../css/shared/Login.css'

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    userType,
    setUserType,
    error,
    successMessage,
    loading,
    handleSubmit,
  } = useLogin()

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>PÁLEVÁ</h1>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Seletor de Tipo de Usuário */}
          <div className="form-group">
            <label htmlFor="userType">Entrar como</label>
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${userType === 'owner' ? 'active' : ''}`}
                onClick={() => setUserType('owner')}
                disabled={loading}
              >
                <span className="user-type-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21M5 21V7L12 3L19 7V21M5 21H19M9 9H15M9 13H15M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Proprietário</span>
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'client' ? 'active' : ''}`}
                onClick={() => setUserType('client')}
                disabled={loading}
              >
                <span className="user-type-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Cliente</span>
              </button>
            </div>
            {!userType && (
              <p className="user-type-hint">Selecione se você é proprietário ou cliente</p>
            )}
          </div>

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
            disabled={loading || !userType}
          >
            {loading ? 'Entrando...' : userType === 'owner' ? 'Entrar como Proprietário' : 'Entrar como Cliente'}
          </button>

          <div className="login-footer">
            <p>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
