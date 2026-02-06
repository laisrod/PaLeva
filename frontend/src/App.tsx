import { BrowserRouter } from 'react-router-dom'
import AuthListener from './components/AuthListener'
import Navbar from './components/Navbar'
import AppRoutes from './components/AppRoutes'
import NotificationToast from './shared/components/NotificationToast'
import { useNotifications } from './shared/hooks/useNotifications'
import { CartProvider } from './client/features/cart/contexts/CartContext'
import './css/shared/App.css'

function App() {
  // Inicializar sistema de notificações
  useNotifications()

  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <AuthListener />
          <Navbar>
            <AppRoutes />
          </Navbar>
          <NotificationToast />
        </CartProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

