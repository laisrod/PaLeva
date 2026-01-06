import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../../shared/services/api'
import Layout from '../components/Layout'
import '../../css/owner/pages/ViewMenu.css'

interface MenuItem {
  id: number
  menu_item_id: number
  name: string
  description: string
  price: number
  category: string
  portions: Array<{
    id: number
    name: string
    price: number
  }>
  image?: string
}

interface Menu {
  id: number
  name: string
  description: string
  items: MenuItem[]
}

export default function ViewMenu() {
  const { code, id } = useParams<{ code: string; id: string }>()
  const navigate = useNavigate()
  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
      return
    }

    if (id) {
      loadMenu(parseInt(id))
    }
  }, [id, navigate])

  const loadMenu = async (menuId: number) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getMenu(menuId)
      
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        // O endpoint getMenu retorna apenas name e description
        // Para ver os itens, precisaríamos de outro endpoint ou usar o endpoint público
        setMenu({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          items: [] // Por enquanto vazio, pode ser expandido depois
        })
      }
    } catch (err) {
      setError('Erro ao carregar cardápio')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="view-menu-container">
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="view-menu-container">
          <div className="error-message">
            <p>{error}</p>
            <Link to={`/establishment/${code}/menus`} className="btn-back">
              ← Voltar para lista de cardápios
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (!menu) {
    return (
      <Layout>
        <div className="view-menu-container">
          <p>Cardápio não encontrado</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="view-menu-container">
        <div className="view-menu-header">
          <Link
            to={`/establishment/${code}/menus`}
            className="btn-back"
          >
            ← Voltar
          </Link>
          <Link
            to={`/establishment/${code}/menus/${menu.id}/edit`}
            className="btn-edit"
          >
            Editar
          </Link>
        </div>

        <div className="menu-details">
          <h1>{menu.name}</h1>
          <p className="menu-description">{menu.description}</p>

          {menu.items.length > 0 ? (
            <div className="menu-items">
              <h2>Itens do Cardápio</h2>
              <div className="items-grid">
                {menu.items.map((item) => (
                  <div key={item.id} className="menu-item-card">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="item-image" />
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-price">
                      A partir de R$ {item.price.toFixed(2)}
                    </div>
                    <div className="item-category">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-menu">
              <p>Este cardápio ainda não possui itens cadastrados.</p>
              <p>Adicione pratos e bebidas ao cardápio para que os clientes possam visualizá-los.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

