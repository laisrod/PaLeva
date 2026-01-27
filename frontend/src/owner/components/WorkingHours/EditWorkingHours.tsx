import { useParams, useNavigate, Link } from 'react-router-dom'
import { useWorkingHours } from '../../hooks/WorkingHours/useWorkingHours'
import Layout from '../Layout/Layout'
import '../../../css/owner/EditWorkingHours.css'

export default function EditWorkingHours() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const {
    workingHours,
    loading,
    saving,
    error,
    success,
    handleChange,
    handleSubmit
  } = useWorkingHours({
    code,
    onSuccess: () => navigate(`/establishment/${code}`)
  })

  if (loading) {
    return (
      <Layout>
        <div className="edit-working-hours-container">
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="edit-working-hours-container">
        <div className="edit-working-hours-header">
          <h1>Horário de Funcionamento</h1>
          <Link
            to={`/establishment/${code}`}
            className="btn-back"
          >
            ← Voltar
          </Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="working-hours-form">
          <div className="working-hours-grid">
            {workingHours.map(wh => (
              <div key={wh.id} className="working-hour-card">
                <div className="working-hour-header">
                  <h3>{wh.week_day}</h3>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={wh.open}
                      onChange={(e) => handleChange(wh.id, 'open', e.target.checked)}
                    />
                    <span className="toggle-slider">
                      {wh.open ? 'Aberto' : 'Fechado'}
                    </span>
                  </label>
                </div>

                {wh.open && (
                  <div className="working-hour-times">
                    <div className="time-input-group">
                      <label>Abertura</label>
                      <input
                        type="time"
                        value={wh.opening_hour || ''}
                        onChange={(e) => handleChange(wh.id, 'opening_hour', e.target.value)}
                        required={wh.open}
                      />
                    </div>
                    <div className="time-input-group">
                      <label>Fechamento</label>
                      <input
                        type="time"
                        value={wh.closing_hour || ''}
                        onChange={(e) => handleChange(wh.id, 'closing_hour', e.target.value)}
                        required={wh.open}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Horários'}
            </button>
            <Link
              to={`/establishment/${code}`}
              className="btn-secondary"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  )
}

