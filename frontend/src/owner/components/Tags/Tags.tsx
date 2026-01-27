import { useParams, Link } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useTags } from '../../hooks/useTags'
import { useTagsActions } from '../../hooks/Tags/useTagsActions'
import Layout from '../Layout/Layout'
import '../../../css/owner/Tags.css'

export default function Tags() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { isOwner } = useAuth()
  const { tags, loading, error } = useTags(code)
  const { handleDeleteTag } = useTagsActions(code)

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
                        onClick={() => handleDeleteTag(tag.id)}
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

