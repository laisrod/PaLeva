import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './shared/pages/Login'
import Register from './shared/pages/Register'
import Home from './shared/pages/Home'
import Menu from './client/pages/Menu'
import RestaurantsList from './client/pages/RestaurantsList'
import CreateEstablishment from './owner/pages/CreateEstablishment'
import Dashboard from './owner/pages/Dashboard'
import Dishes from './owner/pages/Dishes'
import Drinks from './owner/pages/Drinks'
import MenusList from './owner/pages/MenusList'
import CreateMenu from './owner/pages/CreateMenu'
import EditMenu from './owner/pages/EditMenu'
import ViewMenu from './owner/pages/ViewMenu'
import CreateDish from './owner/pages/CreateDish'
import CreateDrink from './owner/pages/CreateDrink'
import Tags from './owner/pages/Tags'
import Orders from './owner/pages/Orders'
import EditWorkingHours from './owner/pages/EditWorkingHours'
import './css/shared/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/establishments/new" element={<CreateEstablishment />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu/:code" element={<Menu />} />
        <Route path="/establishment/:code" element={<Dashboard />} />
        <Route path="/establishment/:code/dishes" element={<Dishes />} />
        <Route path="/establishment/:code/dishes/new" element={<CreateDish />} />
        <Route path="/establishment/:code/drinks" element={<Drinks />} />
        <Route path="/establishment/:code/drinks/new" element={<CreateDrink />} />
        <Route path="/establishment/:code/menus" element={<MenusList />} />
        <Route path="/establishment/:code/menus/new" element={<CreateMenu />} />
        <Route path="/establishment/:code/menus/:id" element={<ViewMenu />} />
        <Route path="/establishment/:code/menus/:id/edit" element={<EditMenu />} />
        <Route path="/establishment/:code/tags" element={<Tags />} />
        <Route path="/establishment/:code/working-hours" element={<EditWorkingHours />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

