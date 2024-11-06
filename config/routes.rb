Rails.application.routes.draw do
  devise_for :users

  root to: 'establishments#index'

  resources :establishments do
    get 'search', on: :collection
    resources :dishes do
      resources :portions

      member do
        patch :toggle_status
      end
    end
    resources :drinks do
      resources :portions
      member do
        patch :toggle_status
      end
    end
    resources :working_hours, only: %i[edit update]
    resources :tags
    resources :menus
  end
  resources :orders
  resources :users
  resources :portions
end
