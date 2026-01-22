module Web
  module Establishments
    class EstablishmentsController < ApplicationController
      include Authorizable

      before_action :authenticate_user!, except: [:show, :index]
      before_action :set_establishment, only: [:edit, :update, :destroy, :search]
      before_action :authorize_owner!, only: [:edit, :update, :destroy]

      def index
        unless current_user
          redirect_to login_path, status: :found
          return
        end

        if current_user&.establishment
          @establishment = current_user.establishment
        else
          @establishment = Establishment.first
        end

        if @establishment
          @working_hours = @establishment.working_hours
        else
          flash.now[:notice] = 'Nenhum estabelecimento cadastrado ainda.'
        end
      end

      def show
        # Se houver ID nos params, buscar por ID
        if params[:id]
          begin
            @establishment = Establishment.find(params[:id])
            # Verificar se o usuário tem permissão para ver este estabelecimento
            if current_user && @establishment.user != current_user
              redirect_to root_path, alert: 'Você não tem permissão para ver este estabelecimento.'
              return
            end
          rescue ActiveRecord::RecordNotFound
            redirect_to root_path, alert: 'Estabelecimento não encontrado.'
            return
          end
        else
          # Caso contrário, usar o estabelecimento do usuário atual
          @establishment = current_user&.establishment
          unless @establishment
            redirect_to new_establishment_path, alert: 'Você precisa criar um estabelecimento primeiro.'
            return
          end
        end
      end  

      def new
        @establishment = Establishment.new
      end

      def create
        unless current_user
          redirect_to root_path, alert: 'Você precisa estar autenticado.'
          return
        end
        
        @establishment = Establishment.new(establishment_params)
        @establishment.user = current_user

        if @establishment.save
          # O callback after_create :set_user_as_owner deve definir role = true
          # Mas vamos garantir que está correto
          current_user.reload
          redirect_to establishment_path(@establishment), notice: 'Estabelecimento cadastrado com sucesso.'
        else
          flash.now[:notice] = 'Estabelecimento não cadastrado.'
          render 'new'
        end
      end

      def edit; end

      def update
        if @establishment.update(establishment_params)
          redirect_to establishment_path(@establishment), notice: 'Estabelecimento atualizado com sucesso.'
        else
          flash.now[:notice] = 'Não foi possivel atualizar o restaurante.'
          render 'edit'
        end
      end

      def destroy
        if @establishment.destroy
          redirect_to root_path, notice: 'Estabelecimento removido com sucesso.'
        else
          redirect_to establishment_path(@establishment), alert: 'Não foi possível remover o estabelecimento.'
        end
      end

      def search
        @establishment = current_user&.establishment
        query = params[:query].to_s.strip
        
        @results = if @establishment
          dish_results = @establishment.dishes
                                 .where('LOWER(name) LIKE :query OR LOWER(description) LIKE :query', 
                                       query: "%#{query.downcase}%")
          
          drink_results = @establishment.drinks
                                  .where('LOWER(name) LIKE :query OR LOWER(description) LIKE :query', 
                                        query: "%#{query.downcase}%")
          
          (dish_results + drink_results).sort_by(&:name)
        else
          []
        end
      end
      
      private

      def establishment_params
        params.require(:establishment).permit(:name, :social_name, :cnpj, :full_address, :city, :state, :postal_code, :email, :phone_number, :state )
      end

      def set_establishment
        @establishment = current_user&.establishment
        unless @establishment
          redirect_to new_establishment_path, alert: 'Você precisa criar um estabelecimento primeiro.'
        end
      end
    end
  end
end
