import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const establishmentCode = localStorage.getItem('establishment_code')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    if (establishmentCode) {
      loadEstablishment(establishmentCode)
    } else {
      setError('Código do estabelecimento não encontrado')
      setLoading(false)
    }
  }, [navigate, establishmentCode])

  const loadEstablishment = async (code: string) => {
    setLoading(true)
    setError('')
    
    try {
      // TODO: Implementar endpoint da API para buscar estabelecimento
      // Por enquanto, vamos usar dados mockados
      const mockEstablishment: Establishment = {
        id: 1,
        name: 'Meu Restaurante',
        phone_number: '(11) 99999-9999',
        code: code,
        working_hours: [
          { id: 1, week_day: 'Segunda', open: true, opening_hour: '08:00', closing_hour: '18:00' },
          { id: 2, week_day: 'Terça', open: true, opening_hour: '08:00', closing_hour: '18:00' },
          { id: 3, week_day: 'Quarta', open: true, opening_hour: '08:00', closing_hour: '18:00' },
          { id: 4, week_day: 'Quinta', open: true, opening_hour: '08:00', closing_hour: '18:00' },
          { id: 5, week_day: 'Sexta', open: true, opening_hour: '08:00', closing_hour: '18:00' },
          { id: 6, week_day: 'Sábado', open: false },
          { id: 7, week_day: 'Domingo', open: false },
        ]
      }
      
      setEstablishment(mockEstablishment)
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
              <p><strong>Telefone:</strong> {establishment.phone_number}</p>
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

          {establishment.working_hours && establishment.working_hours.length > 0 && (
            <div className="dashboard-card">
              <h3 className="card-title">Horário de Funcionamento</h3>
              <div className="card-content">
                <ul className="working-hours-list">
                  {establishment.working_hours.map((workingHour) => (
                    <li key={workingHour.id} className="working-hours-item">
                      <span className="working-hours-day">{workingHour.week_day}</span>
                      <span className={`working-hours-time ${workingHour.open ? 'open' : 'closed'}`}>
                        {workingHour.open
                          ? `${workingHour.opening_hour} às ${workingHour.closing_hour}`
                          : 'Fechado'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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

