Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Healthcheck para load balancers e monitoração
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"
      
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

  # Defines the root path route ("/")
  # root "posts#index"
end
