module Web
  module Establishments
    class MenusController < ApplicationController
      include Authorizable

      before_action :check_establishment!
      before_action :set_establishment
      before_action :authorize_owner!, only: [:new, :create, :edit, :update, :destroy]

      def index
        @menus = @establishment.menus.page(params[:page]).per(20)
      end
      
      def new
        @menu = Menu.new
        @menu.establishment = @establishment
        @dishes = @establishment.dishes
        @drinks = @establishment.drinks
      end

      def create
        @menu = @establishment.menus.build(menu_params)
        @dishes = @establishment.dishes
        @drinks = @establishment.drinks

        if @menu.save
          redirect_to establishment_menu_path(@establishment, @menu), 
                      notice: 'Cardápio criado com sucesso'
        else
          flash.now[:alert] = 'Já existe um cardápio com esse nome neste estabelecimento'
          render :new
        end
      end

      def show
        @menu = Menu.find(params[:id])
      end

      def edit
        @menu = Menu.find(params[:id])
        @dishes = @establishment.dishes
        @drinks = @establishment.drinks
      end

      def update
        @menu = Menu.find(params[:id])
        if @menu.update(menu_params)
          redirect_to establishment_menu_path(@establishment, @menu), notice: 'Cardápio atualizado com sucesso'
        else
          render :edit
        end
      end

      def destroy
        @menu = Menu.find(params[:id])
        @menu.destroy
        redirect_to establishment_menus_path(@establishment), notice: 'Cardápio removido com sucesso'
      end
      
      private

      def set_establishment
        @establishment = Establishment.find(params[:establishment_id])
      end

      def menu_params
        params.require(:menu).permit(:name, :description, menu_items_attributes: [:id, :_destroy, dish_id: [], drink_id: []])
      end
    end
  end
end
