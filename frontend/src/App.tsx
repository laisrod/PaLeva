import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './shared/pages/Login'
import Register from './shared/pages/Register'
import Home from './shared/pages/Home'
import Menu from './client/pages/Menu'
import RestaurantsList from './client/pages/RestaurantsList'
import CreateEstablishment from './owner/pages/CreateEstablishment'
import Dashboard from './owner/pages/Dashboard'
import Dishes from './owner/pages/Dish/Dishes'
import Drinks from './owner/pages/Drink/Drinks'
import MenusList from './owner/pages/MenusList'
import CreateMenu from './owner/pages/CreateMenu'
import EditMenu from './owner/pages/EditMenu'
import ViewMenu from './owner/pages/ViewMenu'
import CreateDish from './owner/pages/Dish/CreateDish'
import EditDish from './owner/pages/Dish/EditDish'
import DishPortions from './owner/pages/DishPortion/DishPortions'
import CreateDishPortion from './owner/pages/DishPortion/CreateDishPortion'
import EditDishPortion from './owner/pages/DishPortion/EditDishPortion'
import CreateDrink from './owner/pages/Drink/CreateDrink'
import EditDrink from './owner/pages/Drink/EditDrink'
import DrinkPortions from './owner/pages/DrinkPortion/DrinkPortions'
import CreateDrinkPortion from './owner/pages/DrinkPortion/CreateDrinkPortion'
import EditDrinkPortion from './owner/pages/DrinkPortion/EditDrinkPortion'
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
        <Route path="/establishment/:code/dishes/:id/edit" element={<EditDish />} />
        <Route path="/establishment/:code/dishes/:id/portions" element={<DishPortions />} />
        <Route path="/establishment/:code/dishes/:id/portions/new" element={<CreateDishPortion />} />
        <Route path="/establishment/:code/dishes/:id/portions/:portionId/edit" element={<EditDishPortion />} />
        <Route path="/establishment/:code/drinks" element={<Drinks />} />
        <Route path="/establishment/:code/drinks/new" element={<CreateDrink />} />
        <Route path="/establishment/:code/drinks/:id/edit" element={<EditDrink />} />
        <Route path="/establishment/:code/drinks/:id/portions" element={<DrinkPortions />} />
        <Route path="/establishment/:code/drinks/:id/portions/new" element={<CreateDrinkPortion />} />
        <Route path="/establishment/:code/drinks/:id/portions/:portionId/edit" element={<EditDrinkPortion />} />
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

