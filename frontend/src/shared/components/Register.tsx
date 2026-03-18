import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import '../../css/shared/Register.css'

export default function Register() {
  const {
    formData,
    userType,
    setUserType,
    error,
    loading,
    handleChange,
    handleCPFChange,
    handleSubmit
  } = useRegister()

  return (
    <div className="register-page">
      <div className="register-bg-overlay" />

      <header className="register-header">
        <div className="register-header-content">
          <h1 className="register-brand">Paleva</h1>
          <Link to="/login" className="register-header-btn">
            Fazer login
          </Link>
        </div>
      </header>

      <main className="register-hero">
        <h2 className="register-hero-title">
          Crie sua conta e comece a usar o Paleva
        </h2>

        <div className="register-form-card">
          <h3 className="register-form-title">Criar conta</h3>

          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="userType">Cadastrar como</label>
              <div className="register-user-type-selector">
                <button
                  type="button"
                  className={`register-user-type-btn ${userType === 'owner' ? 'active' : ''}`}
                  onClick={() => setUserType('owner')}
                  disabled={loading}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21M5 21V7L12 3L19 7V21M5 21H19M9 9H15M9 13H15M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Proprietário</span>
                </button>
                <button
                  type="button"
                  className={`register-user-type-btn ${userType === 'client' ? 'active' : ''}`}
                  onClick={() => setUserType('client')}
                  disabled={loading}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Cliente</span>
                </button>
              </div>
              {!userType && (
                <p className="register-user-type-hint">
                  Selecione se você é proprietário ou cliente
                </p>
              )}
            </div>

            <div className="register-form-row">
              <div className="register-form-group">
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

              <div className="register-form-group">
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

            <div className="register-form-group">
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

            <div className="register-form-group">
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

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimo 6 caracteres"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="password_confirmation">Confirmar senha</label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Repita a senha"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="register-error-msg">{error}</div>
            )}

            <button
              type="submit"
              className="register-btn-submit"
              disabled={loading || !userType}
            >
              {loading
                ? 'Cadastrando...'
                : userType === 'owner'
                  ? 'Cadastrar como Proprietário'
                  : userType === 'client'
                    ? 'Cadastrar como Cliente'
                    : 'Selecione o tipo de conta'}
            </button>
          </form>

          <p className="register-form-footer">
            Ja tem uma conta? <Link to="/login">Faca login</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

