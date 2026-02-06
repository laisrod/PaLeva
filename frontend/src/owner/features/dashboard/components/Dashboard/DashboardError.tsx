import Layout from '../../../../shared/components/Layout/Layout'
import { DashboardErrorProps } from '../../types/dashboard'
import '../../../../../css/owner/Dashboard.css'


export default function DashboardError({ message }: DashboardErrorProps) {
  return (
    <Layout>
      <div className="container">
        <div className="alert alert-danger">
          {message}
        </div>
      </div>
    </Layout>
  )
}
