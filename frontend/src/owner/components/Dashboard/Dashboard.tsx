import Layout from '../Layout/Layout'
import DashboardContent from './DashboardContent'
import DashboardLoading from './DashboardLoading'
import DashboardError from './DashboardError'
import { useDashboard } from '../../hooks/Dashboard/useDashboard'
import '../../../css/owner/Dashboard.css'

export default function Dashboard() {
  const { state, establishment, isOwner, errorMessage } = useDashboard()

  if (state === 'loading') {
    return <DashboardLoading />
  }

  if (state === 'error') {
    return <DashboardError message={errorMessage || 'Erro desconhecido'} />
  }

  if (!establishment) {
    return <DashboardError message="Estabelecimento não encontrado" />
  }

  return (
    <Layout>
      <DashboardContent establishment={establishment} isOwner={isOwner} />
    </Layout>
  )
}

