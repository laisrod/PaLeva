Rails.application.routes.draw do
  devise_for :users
  root to: 'establishments#index'

  resources :establishments do
    get 'search', on: :collection
    resources :working_hours, only: %i[edit update]
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

    resources :portions
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

    resources :employee_invitations
  end

  namespace :api do
    namespace :v1 do
      resources :establishments, param: :code do
        resources :orders, param: :code, only: [:index, :show, :create] do
          member do
            patch :prepare_order, to: 'orders#prepare_order'
            patch :ready_order, to: 'orders#ready_order'
            patch :cancelled, to: 'orders#cancel'
          end
        end
        resources :menus, only: [:index, :create]
        resources :dishes, only: [:index, :create]
        resources :drinks, only: [:index, :create]
        get 'menu', to: 'menus#show'
      end

      resources :menus, only: [:show, :update, :destroy], param: :id
      resources :tags, only: [:index, :create]

      resources :users, only: [:create]
      post '/sign_in', to: 'sessions#create'
      delete '/sign_out', to: 'sessions#destroy'
      get '/is_signed_in', to: 'sessions#is_signed_in?'
    end
  end
end
