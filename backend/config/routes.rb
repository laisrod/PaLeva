Rails.application.routes.draw do
  post '/users/sign_in', to: 'api/v1/sessions#create'
  
  root to: 'web/establishments/establishments#index'

  resources :establishments, controller: 'web/establishments/establishments' do
    get 'search', on: :collection
    resources :working_hours, controller: 'web/establishments/working_hours', only: %i[edit update]
    resources :dishes, controller: 'web/establishments/dishes' do
      resources :portions, controller: 'web/establishments/portions'
      member do
        patch :toggle_status
      end
    end

    resources :drinks, controller: 'web/establishments/drinks' do
      resources :portions, controller: 'web/establishments/portions'
      member do
        patch :toggle_status
      end
    end

    resources :portions, controller: 'web/establishments/portions'
    resources :tags, controller: 'web/establishments/tags'

    resources :menus, controller: 'web/establishments/menus' do
      resources :menu_items, controller: 'web/establishments/menu_items'
    end

    resources :orders, controller: 'web/establishments/orders' do
      member do
        get :add_item, to: 'web/establishments/orders#add_item'
        post :save_item, to: 'web/establishments/orders#save_item'
        delete :remove_item, to: 'web/establishments/orders#remove_item'
        patch :change_status, to: 'web/establishments/orders#change_status'
        patch :cancel, to: 'web/establishments/orders#cancel'
      end
    end

    resources :employee_invitations, controller: 'web/establishments/employee_invitations'
  end

  namespace :api do
    namespace :v1 do
      resources :establishments, param: :code do
        resources :menus, only: [:index, :show, :create, :update, :destroy]
        resources :dishes, only: [:index, :show, :create]
        resources :drinks, only: [:index, :show, :create]
        resources :tags, only: [:index, :create]
        resources :working_hours, only: [:index, :update]
        resources :orders, param: :code, only: [:index, :show] do
          member do
            patch :prepare_order, to: 'orders#prepare_order'
            patch :ready_order, to: 'orders#ready_order'
            patch :cancelled, to: 'orders#cancel'
          end
        end
      end

      resources :users, only: [:create]
      post '/sign_in', to: 'sessions#create'
      delete '/sign_out', to: 'sessions#destroy'
      get '/is_signed_in', to: 'sessions#is_signed_in?'
      post '/set_cookie', to: 'sessions#set_cookie'
    end
  end
end
