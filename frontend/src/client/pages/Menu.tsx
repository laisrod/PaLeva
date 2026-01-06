import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../shared/services/api'
import { useMenu } from '../hooks/useMenu'
import { useCart } from '../hooks/useCart'
import Navigation from '../components/Navigation'
import BottomNavigation from '../components/BottomNavigation'
import MenuCategories from '../components/MenuCategories'
import ProductCard from '../components/ProductCard'
import CartSidebar from '../components/CartSidebar'
import '../../css/client/pages/Menu.css'

export default function Menu() {
  const { code } = useParams<{ code: string }>()
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('takeaway')
  const [location, setLocation] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const { menuItems, categories, selectedCategory, setSelectedCategory, loading } = useMenu(code)
  const { cart, cartTotal, cartItemCount, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
  const deliveryFee = orderType === 'delivery' ? 2 : 0
  const packagingFee = 1
  const total = cartTotal + deliveryFee + packagingFee

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Adicione itens ao carrinho antes de finalizar o pedido')
      return
    }

    if (!code) {
      alert('Código do estabelecimento não encontrado')
      return
    }

    // Solicitar dados do cliente
    const customerName = prompt('Nome completo:')
    if (!customerName) return

    const customerEmail = prompt('Email (opcional):') || undefined
    const customerPhone = prompt('Telefone (opcional):') || undefined

    if (!customerEmail && !customerPhone) {
      alert('É necessário informar pelo menos um email ou telefone')
      return
    }

    setCheckoutLoading(true)

    try {
      // Preparar itens do pedido
      const items = cart.map(item => ({
        menu_item_id: item.menuItemId || item.id,
        portion_id: item.portionId || 1,
        quantity: item.quantity
      }))

      const response = await api.createPublicOrder(code, {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: items
      })

      if (response.error) {
        alert(`Erro ao criar pedido: ${response.error}`)
      } else {
        alert('Pedido criado com sucesso!')
        clearCart()
        setShowCart(false)
      }
    } catch (error) {
      alert('Erro ao processar pedido')
      console.error(error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading">Carregando menu...</div>
      </div>
    )
  }


  return (
    <div className="menu-container">
      <Navigation
        orderType={orderType}
        onOrderTypeChange={setOrderType}
        location={location}
        onLocationChange={setLocation}
        cartItemCount={cartItemCount}
        onCartClick={() => setShowCart(true)}
      />
      
      <div className="menu-content">
        <div className="menu-main">
          <MenuCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <h2 className="category-title">{selectedCategory || 'Menu'}</h2>

          <div className="products-grid">
            {menuItems.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Desktop: sempre visível (via CSS) | Mobile: sidebar que abre/fecha */}
        <CartSidebar
          cart={cart}
          orderType={orderType}
          showCart={true} // Sempre true - CSS controla visibilidade no mobile
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onToggleCart={() => setShowCart(!showCart)}
          subtotal={cartTotal}
          deliveryFee={deliveryFee}
          packagingFee={packagingFee}
          total={total}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
        />
      </div>

      <BottomNavigation />
    </div>
  )
}

