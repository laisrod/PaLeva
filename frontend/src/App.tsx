import { BrowserRouter } from 'react-router-dom'
import AuthListener from './components/AuthListener'
import Navbar from './components/Navbar'
import AppRoutes from './components/AppRoutes'
import NotificationToast from './shared/components/NotificationToast'
import { useNotifications } from './shared/hooks/useNotifications'
import './css/shared/App.css'

function App() {
  // Inicializar sistema de notificações
  useNotifications()

  return (
    <div className="App">
      <BrowserRouter>
        <AuthListener />
        <Navbar>
          <AppRoutes />
        </Navbar>
        <NotificationToast />
      </BrowserRouter>
    </div>
  )
}

export default App

