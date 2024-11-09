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
    resources :menus do
      resources :menu_items
    end
    resources :orders do
      member do
        get :add_item, to: 'orders#add_item'
        post :save_item, to: 'orders#save_item'
        delete :remove_item, to: 'orders#remove_item'
        patch :change_status, to: 'orders#change_status'
        patch :cancel, to: 'orders#cancel'
      end
    end
  end
  resources :users
  resources :portions
end
