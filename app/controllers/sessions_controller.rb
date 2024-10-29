# app/controllers/sessions_controller.rb
class SessionsController < Devise::SessionsController
    def create
      super do |resource|
        if resource.is_a?(User) && resource.establishments.empty?
          # Se o usuário não tiver um estabelecimento, redireciona para o cadastro
          redirect_to new_establishment_path, alert: 'Você precisa cadastrar um restaurante antes de continuar.' and return
        end
      end
    end
  end
  