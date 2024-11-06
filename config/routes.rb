Rails.application.routes.draw do
  get "tags/index"
  get "tags/new"
  get "tags/create"
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
  end
  resources :menus
  resources :orders
  resources :users
  resources :portions
  resources :tags
end
