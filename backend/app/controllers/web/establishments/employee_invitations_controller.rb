module Web
  module Establishments
    class EmployeeInvitationsController < ApplicationController
      include Authorizable

      before_action :check_establishment!
      before_action :set_establishment
      before_action :authorize_owner!

      def index
        @employee_invitations = @establishment.employee_invitations
      end

      def new
        @employee_invitation = @establishment.employee_invitations.new
      end

      def create
        @employee_invitation = @establishment.employee_invitations.new(employee_invitation_params)
        
        if @employee_invitation.save
          redirect_to establishment_employee_invitations_path(@establishment), 
                      notice: 'Convite criado com sucesso!'
        else
          render :new, status: :unprocessable_entity
        end
      end

      def destroy
        @employee_invitation = @establishment.employee_invitations.find(params[:id])
        @employee_invitation.destroy
        
        redirect_to establishment_employee_invitations_path(@establishment), 
                    notice: 'Convite removido com sucesso!'
      end

      private

      def set_establishment
        @establishment = Establishment.find(params[:establishment_id])
      end

      def employee_invitation_params
        params.require(:employee_invitation).permit(:email, :cpf)
      end
    end
  end
end
