module Web
  class RegistrationsController < ApplicationController
    # Não precisamos de autenticação para criar conta
    
    helper_method :firebase_config
    
    def new
      # Sempre exibir a página de registro
    end

    def create
      # Este método será chamado via JavaScript após criar no Firebase
      # O registro real é feito via API /api/v1/users
      redirect_to login_path, notice: 'Conta criada com sucesso! Faça login para continuar.'
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
  end
end
