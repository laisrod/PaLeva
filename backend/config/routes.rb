Rails.application.routes.draw do
  devise_for :users
  
  # Health check endpoint (não requer autenticação)
  get '/up', to: proc { [200, {}, ['OK']] }
  
  root to: 'establishments#index'
  
  # Action Cable mount point
  mount ActionCable.server => '/cable'
  
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
        resources :menus, only: [:index, :show, :create, :update, :destroy] do
          resources :menu_items, only: [:index, :create, :destroy, :update]
        end
        resources :dishes, only: [:index, :show, :create, :update, :destroy] do
          resources :portions, only: [:index, :show, :create, :update, :destroy]
          resources :ratings, only: [:index, :create], controller: 'ratings'
        end
        resources :drinks, only: [:index, :show, :create, :update, :destroy] do
          resources :portions, only: [:index, :show, :create, :update, :destroy], controller: 'drinks_portions'
          resources :ratings, only: [:index, :create], controller: 'ratings'
        end
        resources :tags, only: [:index, :show, :create, :update, :destroy]
        resources :working_hours, only: [:index, :update]
        resources :orders, param: :code, only: [:index, :show, :create, :update, :destroy] do
          resources :items, only: [:create, :update, :destroy], controller: 'order_items'
          resources :reviews, only: [:index, :create], controller: 'reviews'
          member do
            patch :confirm, to: 'orders#confirm'
            patch :prepare_order, to: 'orders#prepare_order'
            patch :ready_order, to: 'orders#ready_order'
            patch :deliver, to: 'orders#deliver'
            patch :cancelled, to: 'orders#cancel'
          end
        end
        # Dashboard de estatísticas
        namespace :dashboard do
          get 'stats', to: 'dashboard#stats'
        end
        # Menu público (todos os pratos e bebidas)
        get 'menu', to: 'establishments#public_menu'
        # Avaliações do estabelecimento
        get 'ratings', to: 'establishments_ratings#index'
      end

      resources :users, only: [:create]
      post '/sign_in', to: 'sessions#create'
      delete '/sign_out', to: 'sessions#destroy'
      get '/is_signed_in', to: 'sessions#is_signed_in?'
      
      # Histórico de pedidos do cliente
      get '/orders/history', to: 'order_history#index'
      get '/orders/history/:id', to: 'order_history#show'
      
      # Reviews e Ratings
      resources :reviews, only: [:show]
      resources :ratings, only: [:show]
    end
  end
end