import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/EditWorkingHours.css'

interface WorkingHour {
  id: number
  week_day: string
  opening_hour: string | null
  closing_hour: string | null
  open: boolean
}

export default function EditWorkingHours() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    if (code) {
      loadWorkingHours()
    }
  }, [navigate, code])

  const loadWorkingHours = async () => {
    if (!code) return

    setLoading(true)
    setError('')

    try {
      const response = await api.getWorkingHours(code)

      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setWorkingHours(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar horários de funcionamento')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (id: number, field: string, value: string | boolean) => {
    setWorkingHours(prev => prev.map(wh => 
      wh.id === id ? { ...wh, [field]: value } : wh
    ))
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updatePromises = workingHours.map(wh =>
        api.updateWorkingHour(code, wh.id, {
          opening_hour: wh.opening_hour || '',
          closing_hour: wh.closing_hour || '',
          open: wh.open
        })
      )

      const results = await Promise.all(updatePromises)
      const hasError = results.some(r => r.error)

      if (hasError) {
        const errors = results
          .filter(r => r.error)
          .map(r => r.error)
          .flat()
        setError(errors.join(', '))
      } else {
        setSuccess('Horários de funcionamento atualizados com sucesso!')
        setTimeout(() => {
          navigate(`/establishment/${code}`)
        }, 1500)
      }
    } catch (err) {
      setError('Erro ao atualizar horários de funcionamento')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

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

