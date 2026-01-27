import '../../../css/owner/CreateEstablishment.css'
import { useCreateEstablishmentPage } from '../../hooks/Establishment/useCreateEstablishmentPage'
import CreateEstablishmentLoading from './CreateEstablishmentLoading'

export default function CreateEstablishment() {
  const {
    authLoading,
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  } = useCreateEstablishmentPage()

  if (authLoading) {
    return <CreateEstablishmentLoading />
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

