# frozen_string_literal: true

class WorkingHoursController < ApplicationController
  before_action :set_establishment
  before_action :set_working_hour, only: %i[edit update]

  def edit; end

  def update
    if @working_hour.update(working_hour_params)
      redirect_to root_path, notice: 'Horário de funcionamento atualizado com sucesso'
    else
      render :edit
    end
  end

  private

  def set_establishment
    @establishment = current_user.establishment
  end

  def set_working_hour
    @working_hour = @establishment.working_hours.find(params[:id])
  end

  def working_hour_params
    params.require(:working_hour).permit(:opening_hour, :closing_hour, :open)
  end
end
