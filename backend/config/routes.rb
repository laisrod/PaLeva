Rails.application.routes.draw do
  devise_for :users
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
        end
        resources :drinks, only: [:index, :show, :create, :update, :destroy] do
          resources :portions, only: [:index, :show, :create, :update, :destroy], controller: 'drinks_portions'
        end
        resources :tags, only: [:index, :show, :create, :update, :destroy]
        resources :working_hours, only: [:index, :update]
        resources :orders, param: :code, only: [:index, :show, :create, :update, :destroy] do
          resources :items, only: [:create, :update, :destroy], controller: 'order_items'
          member do
            patch :confirm, to: 'orders#confirm'
            patch :prepare_order, to: 'orders#prepare_order'
            patch :ready_order, to: 'orders#ready_order'
            patch :deliver, to: 'orders#deliver'
            patch :cancelled, to: 'orders#cancel'
          end
        end
      end

      resources :users, only: [:create]
      post '/sign_in', to: 'sessions#create'
      delete '/sign_out', to: 'sessions#destroy'
      get '/is_signed_in', to: 'sessions#is_signed_in?'
    end
  end
end


# config/routes.rb
Rails.application.routes.draw do
  # ... suas rotas normais aqui em cima ...

  # Catch-all para OPTIONS (preflight) - força resposta CORS
  match '*path', via: :options, to: lambda { |env|
    origin = env['HTTP_ORIGIN']
    headers = {
      'Access-Control-Allow-Origin'  => origin || '*',
      'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers' => 'Content-Type, Authorization, Accept, Origin',
      'Access-Control-Allow-Credentials' => 'true',
      'Access-Control-Max-Age'       => '86400',
      'Content-Length'               => '0',
      'Content-Type'                 => 'text/plain'
    }
    [204, headers, []]
  }
end