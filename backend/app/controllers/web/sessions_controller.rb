module Web
  class SessionsController < ApplicationController
    # Não precisamos de autenticação para as ações new e create
    # authenticate_user! não é um before_action global, então não precisamos skip
    
    helper_method :firebase_config
    
    def new
      # Sempre exibir a página de login, mesmo se já estiver autenticado
      # O usuário pode querer fazer login com outra conta
    end
    
    private
    
    def firebase_config
      {
        apiKey: ENV['FIREBASE_API_KEY'] || ENV['VITE_FIREBASE_API_KEY'] || '',
        authDomain: ENV['FIREBASE_AUTH_DOMAIN'] || ENV['VITE_FIREBASE_AUTH_DOMAIN'] || 'palevar.firebaseapp.com',
        projectId: ENV['FIREBASE_PROJECT_ID'] || ENV['VITE_FIREBASE_PROJECT_ID'] || 'palevar',
        storageBucket: ENV['FIREBASE_STORAGE_BUCKET'] || ENV['VITE_FIREBASE_STORAGE_BUCKET'] || 'palevar.appspot.com',
        messagingSenderId: ENV['FIREBASE_MESSAGING_SENDER_ID'] || ENV['VITE_FIREBASE_MESSAGING_SENDER_ID'] || '',
        appId: ENV['FIREBASE_APP_ID'] || ENV['VITE_FIREBASE_APP_ID'] || ''
      }
    end

    def create
      token = params[:firebase_token]
      
      unless token
        flash.now[:alert] = 'Token Firebase é obrigatório.'
        render :new, status: :unprocessable_entity
        return
      end

      # Validar token do Firebase
      firebase_data = FirebaseTokenValidator.validate(token)
      
      unless firebase_data
        flash.now[:alert] = 'Token Firebase inválido.'
        render :new, status: :unprocessable_entity
        return
      end

      # Buscar ou criar usuário
      user = User.find_by(email: firebase_data[:email])
      
      unless user
        flash.now[:alert] = 'Usuário não encontrado. Por favor, registre-se primeiro.'
        render :new, status: :unprocessable_entity
        return
      end

      # Definir cookie com o token
      cookies[:firebase_token] = {
        value: token,
        expires: 1.hour.from_now,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      }

      redirect_to root_path, notice: 'Login realizado com sucesso!'
    end

    def destroy
      cookies.delete(:firebase_token)
      redirect_to login_path, notice: 'Logout realizado com sucesso!'
    end
  end
end
