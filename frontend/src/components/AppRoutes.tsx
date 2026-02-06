import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../shared/components/Login'
import Register from '../shared/components/Register'
import Home from '../shared/components/Home'
import Menu from '../client/features/menu/pages/Menu'
import RestaurantsList from '../client/features/restaurants/pages/RestaurantsList'
import OrderHistory from '../client/features/orders/pages/OrderHistory'
import CreateEstablishment from '../owner/features/establishments/components/Establishment/CreateEstablishment'
import EditEstablishment from '../owner/features/establishments/components/Establishment/EditEstablishment'
import Dashboard from '../owner/features/dashboard/components/Dashboard/Dashboard'
import Dishes from '../owner/features/dishes/components/Dish/Dishes'
import Drinks from '../owner/features/drinks/components/Drink/Drinks'
import MenusList from '../owner/features/menus/components/Menu/MenusList'
import CreateMenu from '../owner/features/menus/components/Menu/CreateMenu'
import EditMenu from '../owner/features/menus/components/Menu/EditMenu'
import ViewMenu from '../owner/features/menus/components/Menu/ViewMenu'
import CreateDish from '../owner/features/dishes/components/Dish/CreateDish'
import EditDish from '../owner/features/dishes/components/Dish/EditDish'
import DishPortions from '../owner/features/dishes/components/DishPortion/DishPortions'
import CreateDishPortion from '../owner/features/dishes/components/DishPortion/CreateDishPortion'
import EditDishPortion from '../owner/features/dishes/components/DishPortion/EditDishPortion'
import CreateDrink from '../owner/features/drinks/components/Drink/CreateDrink'
import EditDrink from '../owner/features/drinks/components/Drink/EditDrink'
import DrinkPortions from '../owner/features/drinks/components/DrinkPortion/DrinkPortions'
import CreateDrinkPortion from '../owner/features/drinks/components/DrinkPortion/CreateDrinkPortion'
import EditDrinkPortion from '../owner/features/drinks/components/DrinkPortion/EditDrinkPortion'
import Tags from '../owner/features/tags/components/Tags/Tags'
import CreateTag from '../owner/features/tags/components/Tags/CreateTag'
import EditTag from '../owner/features/tags/components/Tags/EditTag'
import Orders from '../owner/features/orders/components/Orders/Orders'
import EditWorkingHours from '../owner/features/working-hours/components/WorkingHours/EditWorkingHours'
import TestCreateOrder from '../owner/features/orders/components/Orders/TestCreateOrder'
import Ratings from '../owner/features/ratings/pages/Ratings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants" element={<RestaurantsList />} />
      <Route path="/orders/history" element={<OrderHistory />} />
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
      <Route path="/establishment/:code/tags/new" element={<CreateTag />} />
      <Route path="/establishment/:code/tags/:id/edit" element={<EditTag />} />
      <Route path="/establishment/:code/tags" element={<Tags />} />
      <Route path="/establishment/:code/working-hours" element={<EditWorkingHours />} />
      <Route path="/establishment/:code/ratings" element={<Ratings />} />
      <Route path="/establishment/:code/test-order" element={<TestCreateOrder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
