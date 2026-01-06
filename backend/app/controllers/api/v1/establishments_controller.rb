module Api
  module V1
    class EstablishmentsController < ApplicationController
      include AuthenticableApi

      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!, only: [:create]

      # Lista todos os estabelecimentos disponíveis para os clientes
      def index
        establishments = Establishment.select(:id, :name, :code, :city, :state)

        render json: establishments.as_json(only: %i[id name code city state])
      end

      # Mostra detalhes de um estabelecimento pelo código público
      def show
        establishment = Establishment.find_by!(code: params[:code])

        render json: establishment.as_json(
          only: %i[id name code city state],
          methods: []
        )
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      # Cria um novo estabelecimento (requer autenticação)
      def create
        Rails.logger.info "=== CREATE ESTABLISHMENT DEBUG ==="
        Rails.logger.info "Params: #{params.inspect}"
        Rails.logger.info "Establishment params: #{establishment_params.inspect}"
        
        # Verificar se o usuário já tem um estabelecimento
        if current_api_user.establishment.present?
          Rails.logger.info "User already has establishment"
          render json: { error: 'Você já possui um estabelecimento cadastrado' }, status: :unprocessable_entity
          return
        end

        @establishment = Establishment.new(establishment_params)
        @establishment.user = current_api_user

        Rails.logger.info "Establishment attributes: #{@establishment.attributes.inspect}"
        Rails.logger.info "Establishment valid?: #{@establishment.valid?}"
        
        if @establishment.save
          # Atualizar o role do usuário (já feito pelo callback, mas garantimos)
          current_api_user.update(role: true) unless current_api_user.role?

          render json: {
            establishment: @establishment.as_json(
              only: %i[id name code city state],
              methods: []
            ),
            message: 'Estabelecimento cadastrado com sucesso'
          }, status: :created
        else
          Rails.logger.error "Establishment errors: #{@establishment.errors.full_messages.inspect}"
          Rails.logger.error "Establishment errors details: #{@establishment.errors.details.inspect}"
          render json: { 
            error: 'Não foi possível criar o estabelecimento',
            errors: @establishment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def establishment_params
        params.require(:establishment).permit(
          :name, :social_name, :cnpj, :full_address, 
          :city, :state, :postal_code, :email, :phone_number
        )
      end
    end
  end
end


