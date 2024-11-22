module Api
  module V1
    class UsersController < ApplicationController  
      def create
        @user = User.new(user_params)
        if @user.save
          session[:user_id] = @user.id
          render json: {
            status: :created,
            user: @user
          }
        else 
          @user.save
          render json: {
            status: 500,
            error: @user.errors.full_messages
          }
        end
      end

      private
        
      def user_params
        params.require(:user).permit(:name, :email, :last_name, :cpf, :password, :password_confirmation)
      end
    end
  end
end
