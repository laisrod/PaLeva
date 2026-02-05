import { Link } from 'react-router-dom'
import { DashboardContentProps } from '../../types/dashboard'
import DashboardStats from './DashboardStats'
import '../../../css/owner/Dashboard.css'


export default function DashboardContent({ establishment, isOwner }: DashboardContentProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">PÁLEVÁ</h1>
        <h2 className="dashboard-subtitle">{establishment.name}</h2>
      </div>

      {/* Seção de Estatísticas */}
      <DashboardStats establishmentCode={establishment.code} />

      <div className="dashboard-grid">
        {/* Card: Informações do Estabelecimento */}
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
              <Link
                to={`/establishment/${establishment.code}/edit`}
                className="dashboard-btn btn-outline-owner"
              >
                Editar
              </Link>
            )}
          </div>
        </div>

        {/* Card: Cardápios */}
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
                Criar Cardápio
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

        {/* Card: Pratos */}
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
                Novo Prato
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

        {/* Card: Bebidas */}
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
                Nova Bebida
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

        {/* Card: Horário de Funcionamento */}
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

        {/* Card: Pedidos */}
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
  )
}
