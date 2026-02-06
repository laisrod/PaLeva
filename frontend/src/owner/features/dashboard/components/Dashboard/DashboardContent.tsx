import { Link } from 'react-router-dom'
import { DashboardContentProps } from '../../types/dashboard'
import DashboardStats from './DashboardStats'
import '../../../../../css/owner/Dashboard.css'


export default function DashboardContent({ establishment, isOwner }: DashboardContentProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">PÁLEVÁ</h1>
        <h2 className="dashboard-subtitle">{establishment.name}</h2>
      </div>

      {/* Seção de Estatísticas */}
      <DashboardStats establishmentCode={establishment.code} />

      {/* Card: Informações do Estabelecimento */}
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
              <Link
                to={`/establishment/${establishment.code}/edit`}
                className="dashboard-btn btn-outline-owner"
              >
                Editar
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
