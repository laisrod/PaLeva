Rails.application.routes.draw do
  devise_for :users

  root to: 'establishments#index'

  resources :establishments do
    get 'search', on: :collection
    resources :dishes do
      member do
        patch :toggle_status
      end
    end
    resources :drinks do
      member do
        patch :toggle_status
      end
    end
    resources :portions, only: %i[new create edit update destroy]
    resources :working_hours, only: %i[edit update]
  end
  resources :menus
  resources :orders
  resources :users
end
