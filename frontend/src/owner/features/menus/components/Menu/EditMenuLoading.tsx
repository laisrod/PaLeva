import Layout from '../../../../shared/components/Layout/Layout'
import '../../../../../css/owner/CreateMenu.css'

export default function EditMenuLoading() {
  return (
    <Layout>
      <div className="create-menu-container">
        <div className="create-menu-card">
          <p>Carregando...</p>
        </div>
      </div>
    </Layout>
  )
}
