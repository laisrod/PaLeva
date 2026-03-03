import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import AppRoutes from './components/AppRoutes'
import NotificationToast from './shared/components/NotificationToast'
import { useNotifications } from './shared/hooks/useNotifications'
import { AuthProvider } from './shared/hooks/useAuth'
import { CartProvider } from './client/features/cart/contexts/CartContext'
import './css/shared/App.css'

function AppContent() {
  // Inicializar sistema de notificações quando auth estiver disponível no contexto
  useNotifications()

  return (
    <>
      <Navbar>
        <AppRoutes />
      </Navbar>
      <NotificationToast />
    </>
  )
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
