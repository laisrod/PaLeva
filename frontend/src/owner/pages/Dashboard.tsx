import { useState, useEffect } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/Dashboard.css'

interface Establishment {
  id: number
  name: string
  phone_number: string
  code: string
  working_hours?: Array<{
    id: number
    week_day: string
    open: boolean
    opening_hour?: string
    closing_hour?: string
  }>
}

export default function Dashboard() {
  const { code } = useParams<{ code: string }>()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    if (code) {
      // Salvar código no localStorage para uso posterior
      localStorage.setItem('establishment_code', code)
      loadEstablishment(code)
    } else {
      setError('Código do estabelecimento não encontrado')
      setLoading(false)
    }
  }, [navigate, code])

  const loadEstablishment = async (code: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getEstablishment(code)
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setEstablishment(response.data)
      } else {
        setError('Estabelecimento não encontrado')
      }
    } catch (err) {
      setError('Erro ao carregar estabelecimento')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !establishment) {
    return (
      <Layout>
        <div className="container">
          <div className="alert alert-danger">
            {error || 'Estabelecimento não encontrado'}
          </div>
        </div>
      </Layout>
    )
  }

  const isOwner = true // TODO: Verificar se o usuário é dono

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">PaLeva</h1>
          <h2 className="dashboard-subtitle">{establishment.name}</h2>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3 className="card-title">Informações do Estabelecimento</h3>
            <div className="card-content">
              {establishment.phone_number && (
                <p><strong>Telefone:</strong> {establishment.phone_number}</p>
              )}
              <p><strong>Código:</strong> {establishment.code}</p>
            </div>
            <div className="card-actions">
              {isOwner && (
                <>
                  <Link
                    to={`/establishment/${establishment.code}/edit`}
                    className="dashboard-btn btn-outline-owner"
                  >
                    Editar
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Cardápios</h3>
            <div className="card-content">
              <p>Gerencie seus cardápios e menus</p>
            </div>
            <div className="card-actions">
              {isOwner && (
                <Link
                  to={`/establishment/${establishment.code}/menus/new`}
                  className="dashboard-btn btn-primary-owner"
                >
                  ➕ Criar Cardápio
                </Link>
              )}
              <Link
                to={`/establishment/${establishment.code}/menus`}
                className="dashboard-btn btn-outline-owner"
              >
                Ver Cardápios
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Pratos</h3>
            <div className="card-content">
              <p>Gerencie seus pratos e características</p>
            </div>
            <div className="card-actions">
              {isOwner && (
                <Link
                  to={`/establishment/${establishment.code}/dishes/new`}
                  className="dashboard-btn btn-primary-owner"
                >
                  ➕ Novo Prato
                </Link>
              )}
              <Link
                to={`/establishment/${establishment.code}/dishes`}
                className="dashboard-btn btn-outline-owner"
              >
                Ver Pratos
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Bebidas</h3>
            <div className="card-content">
              <p>Gerencie suas bebidas</p>
            </div>
            <div className="card-actions">
              {isOwner && (
                <Link
                  to={`/establishment/${establishment.code}/drinks/new`}
                  className="dashboard-btn btn-primary-owner"
                >
                  ➕ Nova Bebida
                </Link>
              )}
              <Link
                to={`/establishment/${establishment.code}/drinks`}
                className="dashboard-btn btn-outline-owner"
              >
                Ver Bebidas
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Horário de Funcionamento</h3>
            <div className="card-content">
              {establishment.working_hours && establishment.working_hours.length > 0 ? (
                <ul className="working-hours-list">
                  {establishment.working_hours.map((workingHour) => (
                    <li key={workingHour.id} className="working-hours-item">
                      <span className="working-hours-day">{workingHour.week_day}</span>
                      <span className={`working-hours-time ${workingHour.open ? 'open' : 'closed'}`}>
                        {workingHour.open && workingHour.opening_hour && workingHour.closing_hour
                          ? `${workingHour.opening_hour} às ${workingHour.closing_hour}`
                          : 'Fechado'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum horário configurado</p>
              )}
            </div>
            <div className="card-actions">
              {isOwner && (
                <Link
                  to={`/establishment/${establishment.code}/working-hours`}
                  className="dashboard-btn btn-primary-owner"
                >
                  Editar Horários
                </Link>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="card-title">Pedidos</h3>
            <div className="card-content">
              <p>Visualize e gerencie os pedidos do seu estabelecimento</p>
            </div>
            <div className="card-actions">
              <Link
                to={`/establishment/${establishment.code}/orders`}
                className="dashboard-btn btn-primary-owner"
              >
                Ver Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

