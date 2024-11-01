Rails.application.routes.draw do
  devise_for :users

  root to: 'establishments#index'

  resources :establishments do
    resources :dishes
    resources :drinks
    resources :working_hours, only: %i[edit update]
  end
  resources :menus
  resources :orders
  resources :users
end
