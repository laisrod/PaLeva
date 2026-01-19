module Api
  module V1
    class EstablishmentsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user_for_create!, only: [:create]
      
      def index
        @establishments = Establishment.all
        render json: @establishments.as_json(only: [:id, :name, :code, :city, :state])
      end

      def show
        @establishment = Establishment.find_by!(code: params[:code])
        render json: @establishment.as_json(
          only: [:id, :name, :code, :city, :state, :full_address, :phone_number, :email],
          include: {
            working_hours: {
              only: [:id, :week_day, :opening_hour, :closing_hour, :open]
            }
          }
        )
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def create
        @establishment = Establishment.new(establishment_params)
        @establishment.user = current_api_user

        if @establishment.save
          render json: {
            establishment: @establishment.as_json(only: [:id, :name, :code, :city, :state]),
            message: 'Estabelecimento criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @establishment.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      private

      def authenticate_api_user_for_create!
        token = request.headers['Authorization']&.split&.last
        return render json: { error: 'Não autorizado' }, status: :unauthorized unless token

        # Validar token do Firebase
        firebase_data = FirebaseTokenValidator.validate(token)
        return render json: { error: 'Token inválido' }, status: :unauthorized unless firebase_data

        # Buscar usuário pelo email do Firebase
        @current_api_user = User.find_by(email: firebase_data[:email])
        
        unless @current_api_user
          render json: { error: 'Usuário não encontrado' }, status: :unauthorized
        end
      end

      def current_api_user
        @current_api_user
      end

      def establishment_params
        params.require(:establishment).permit(
          :name, :social_name, :cnpj, :full_address, 
          :city, :state, :postal_code, :email, :phone_number
        )
      end
    end
  end
end

