import { BrowserRouter } from 'react-router-dom'
import AuthListener from './components/AuthListener'
import Navbar from './components/Navbar'
import AppRoutes from './components/AppRoutes'
import './css/shared/App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthListener />
        <Navbar>
          <AppRoutes />
        </Navbar>
      </BrowserRouter>
    </div>
  )
}

export default App

