import { Link } from 'react-router-dom'
import Layout from '../../../../shared/components/Layout/Layout'
import { useDrinkPortionsPage } from '../../hooks/DrinkPortion/useDrinkPortionsPage'
import '../../../../../css/owner/Dishes.css'

export default function DrinkPortions() {
  const {
    establishmentCode,
    drinkId,
    isOwner,
    portions,
    loading,
    error,
    deletePortion,
    deleting
  } = useDrinkPortionsPage()

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
      <div className="dishes-container">
        <div className="dishes-header">
          <h1 className="dishes-title">Porções</h1>
          <div className="dishes-actions">
            {isOwner && (
              <Link
                to={`/establishment/${establishmentCode}/drinks/${drinkId}/portions/new`}
                className="dishes-btn dishes-btn-primary"
              >
                Nova Porção
              </Link>
            )}
            <Link
              to={`/establishment/${establishmentCode}/drinks`}
              className="dishes-btn dishes-btn-secondary"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {portions.length > 0 ? (
          <div className="dishes-grid">
            {portions.map(portion => (
              <div key={portion.id} className="dish-card">
                <h3 className="dish-card-title">{portion.description}</h3>
                <p className="dish-card-description">
                  R$ {portion.price.toFixed(2).replace('.', ',')}
                </p>
                <div className="dish-card-actions">
                  {isOwner && (
                    <>
                      <Link
                        to={`/establishment/${establishmentCode}/drinks/${drinkId}/portions/${portion.id}/edit`}
                        className="dish-card-btn dish-card-btn-primary"
                      >
                        Editar
                      </Link>
                      <button
                        className="dish-card-btn dish-card-btn-danger"
                        onClick={async () => {
                          if (window.confirm('Tem certeza que deseja remover esta porção?')) {
                            await deletePortion(portion.id)
                          }
                        }}
                        disabled={deleting}
                      >
                        {deleting ? 'Removendo...' : 'Remover'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma porção cadastrada</p>
            {isOwner && (
              <Link
                to={`/establishment/${establishmentCode}/drinks/${drinkId}/portions/new`}
                className="dishes-btn dishes-btn-primary mt-3"
              >
                Criar Primeira Porção
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
