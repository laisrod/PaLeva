import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../shared/hooks/useRequireAuth'
import { useTags } from '../hooks/useTags'
import Layout from '../components/Layout'
import '../../css/owner/pages/Tags.css'

export default function Tags() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { tags, loading, error, deleteTag } = useTags(code)

  const handleDelete = async (tagId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta característica?')) return
    
    const success = await deleteTag(tagId)
    if (!success) {
      alert('Erro ao excluir característica')
    }
  }

  const isOwner = true // TODO: Verificar se o usuário é dono

  if (loading) {
    return (
      <Layout>
        <div className="container mt-4">
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Características</h1>
            {isOwner && (
              <Link
                to={`/establishment/${code}/tags/new`}
                className="btn btn-primary"
              >
                Criar Característica
              </Link>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="list-group">
              {tags.map(tag => (
                <div
                  key={tag.id}
                  className="list-group-item d-flex justify-content-between align-items-center mb-2"
                >
                  <h4 className="mb-0">
                    <Link
                      to={`/establishment/${code}/tags/${tag.id}`}
                      className="text-decoration-none"
                    >
                      {tag.name}
                    </Link>
                  </h4>
                  {isOwner && (
                    <div className="btn-group">
                      <Link
                        to={`/establishment/${code}/tags/${tag.id}/edit`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <Link
              to={`/establishment/${code}/dishes`}
              className="btn btn-secondary"
            >
              Voltar para Pratos
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

