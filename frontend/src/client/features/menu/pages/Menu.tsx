import Navigation from '../../../shared/components/Navigation'
import BottomNavigation from '../../../shared/components/BottomNavigation'
import MenuCategories from '../components/MenuCategories'
import ProductCard from '../components/ProductCard'
import CartSidebar from '../../cart/components/CartSidebar'
import { useMenuPage } from '../hooks/useMenuPage'
import '../../../../css/client/pages/Menu.css'

export default function Menu() {
  const {
    orderType,
    setOrderType,
    location,
    setLocation,
    showCart,
    setShowCart,
    checkoutLoading,
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    cart,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    deliveryFee,
    packagingFee,
    total,
    handleCheckout
  } = useMenuPage()

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

          {menuItems.length === 0 ? (
            <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>Nenhum item encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="products-grid">
              {menuItems.map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>

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

