module Api
  module V1
    class WorkingHoursController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @working_hours = @establishment.working_hours.order(:id)
        render json: @working_hours.as_json(only: [:id, :week_day, :opening_hour, :closing_hour, :open])
      end

      def update
        @working_hour = @establishment.working_hours.find(params[:id])
        
        if @working_hour.update(working_hour_params)
          render json: {
            working_hour: @working_hour.as_json(only: [:id, :week_day, :opening_hour, :closing_hour, :open]),
            message: 'Horário atualizado com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @working_hour.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Horário não encontrado' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def working_hour_params
        params.require(:working_hour).permit(:opening_hour, :closing_hour, :open)
      end
    end
  end
end

