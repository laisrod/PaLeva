import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../shared/pages/Login'
import Register from '../shared/pages/Register'
import Home from '../shared/pages/Home'
import Menu from '../client/pages/Menu'
import RestaurantsList from '../client/pages/RestaurantsList'
import CreateEstablishment from '../owner/components/Establishment/CreateEstablishment'
import EditEstablishment from '../owner/components/Establishment/EditEstablishment'
import Dashboard from '../owner/components/Dashboard/Dashboard'
import Dishes from '../owner/components/Dish/Dishes'
import Drinks from '../owner/components/Drink/Drinks'
import MenusList from '../owner/components/Menu/MenusList'
import CreateMenu from '../owner/components/Menu/CreateMenu'
import EditMenu from '../owner/components/Menu/EditMenu'
import ViewMenu from '../owner/components/Menu/ViewMenu'
import CreateDish from '../owner/components/Dish/CreateDish'
import EditDish from '../owner/components/Dish/EditDish'
import DishPortions from '../owner/components/DishPortion/DishPortions'
import CreateDishPortion from '../owner/components/DishPortion/CreateDishPortion'
import EditDishPortion from '../owner/components/DishPortion/EditDishPortion'
import CreateDrink from '../owner/components/Drink/CreateDrink'
import EditDrink from '../owner/components/Drink/EditDrink'
import DrinkPortions from '../owner/components/DrinkPortion/DrinkPortions'
import CreateDrinkPortion from '../owner/components/DrinkPortion/CreateDrinkPortion'
import EditDrinkPortion from '../owner/components/DrinkPortion/EditDrinkPortion'
import Tags from '../owner/components/Tags/Tags'
import Orders from '../owner/components/Orders/Orders'
import EditWorkingHours from '../owner/components/WorkingHours/EditWorkingHours'
import TestCreateOrder from '../owner/components/Orders/TestCreateOrder'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants" element={<RestaurantsList />} />
      <Route path="/establishments/new" element={<CreateEstablishment />} />
      <Route path="/establishment/:code/edit" element={<EditEstablishment />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/establishment/:code/orders" element={<Orders />} />
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
      <Route path="/establishment/:code/test-order" element={<TestCreateOrder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
