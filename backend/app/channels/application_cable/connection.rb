module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # Tentar obter email do query parameter (para WebSocket) ou do header (para HTTP)
      email = request.params[:email] || request.headers['Authorization']&.split&.last
      
      return reject_unauthorized_connection unless email

      user = User.find_by(email: email)
      
      return reject_unauthorized_connection unless user

      user
    end

    def reject_unauthorized_connection
      reject
    end
  end
end
