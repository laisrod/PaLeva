import Layout from '../../../../shared/components/Layout/Layout'
import '../../../../../css/owner/Dashboard.css'

export default function DashboardLoading() {
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
