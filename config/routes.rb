Rails.application.routes.draw do
  devise_for :users

  root to: 'establishments#index'

  resources :establishments do
    resources :dishes
    resources :drinks
  end
  resources :menus
  resources :orders
  resources :users
end
