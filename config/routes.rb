Rails.application.routes.draw do
  root to: 'establishments#index'

  resources :establishments do
    member do
      get 'employees'
      resources :users
    end
  end
  resources :menus
  resources :orders
  resources :users
end
