import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import { useEditEstablishmentPage } from '../../hooks/Establishment/useEditEstablishmentPage'
import '../../../../../css/owner/CreateMenu.css'

export default function EditEstablishment() {
  const {
    establishmentCode,
    establishment,
    formData,
    errors,
    loading,
    loadingEstablishment,
    handleChange,
    handleSubmit,
  } = useEditEstablishmentPage()

  if (loadingEstablishment) {
    return (
      <Layout>
        <div className="create-menu-container">
          <div className="create-menu-card">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!establishment) {
    return (
      <Layout>
        <div className="create-menu-container">
          <div className="create-menu-card">
            <p>Estabelecimento não encontrado.</p>
            <Link
              to={establishmentCode ? `/establishment/${establishmentCode}` : '/'}
              className="btn-secondary"
            >
              Voltar
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <div className="menu-header">
            <h1>Editar Informações do Estabelecimento</h1>
            <Link
              to={`/establishment/${establishmentCode}`}
              className="btn-back"
            >
              ← Voltar
            </Link>
          </div>

          {errors.length > 0 && (
            <div className="error-message">
              <h3>{errors.length === 1 ? 'Erro' : `${errors.length} erros`}:</h3>
              <ul>
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Código</label>
              <input
                id="code"
                type="text"
                value={establishment.code}
                readOnly
                disabled
                style={{ opacity: 0.8, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do estabelecimento"
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

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@exemplo.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="full_address">Endereço</label>
              <input
                id="full_address"
                name="full_address"
                type="text"
                value={formData.full_address}
                onChange={handleChange}
                placeholder="Rua, número, complemento"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Cidade"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">Estado</label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="UF"
                maxLength={2}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <Link
                to={`/establishment/${establishmentCode}`}
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
