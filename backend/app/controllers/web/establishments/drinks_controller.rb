module Web
  module Establishments
    class DrinksController < ApplicationController
      include Authorizable

      before_action :check_establishment!
      before_action :set_establishment
      before_action :set_drink, only: [:show, :edit, :update, :destroy, :toggle_status]
      before_action :authorize_owner!, only: [:new, :create, :edit, :update, :destroy, :toggle_status]

      def index
        @drinks = @establishment.drinks.page(params[:page]).per(20)
      end

      def show
        @portionable = @drink.portions
        @price_histories = PriceHistory.where(portion: @drink.portions)
      end

      def new
        @drink = @establishment.drinks.build
      end

      def create
        @drink = @establishment.drinks.build(drink_params)
        if @drink.save
          redirect_to establishment_drink_path(@establishment, @drink), notice: 'Drink was successfully created.'
        else
          render :new
        end
      end

      def edit
      end

      def update
        if @drink.update(drink_params)
          redirect_to establishment_drink_path(@establishment, @drink), notice: 'Bebida atualizada com sucesso.'
        else
          render :edit
        end
      end

      def destroy
        @drink.destroy
        redirect_to establishment_drinks_path(@establishment), notice: 'Bebida excluída com sucesso.'
      end
      
      def toggle_status
        @drink.update(status: !@drink.status)
        redirect_to establishment_drink_path(@establishment, @drink), notice: 'Status atualizado com sucesso!'
      end

      private

      def set_establishment
        @establishment = Establishment.find(params[:establishment_id])
      end

      def set_drink
        @drink = @establishment.drinks.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        redirect_to root_path, alert: 'Bebida não encontrada para este estabelecimento.'
      end

      def drink_params
        params.require(:drink).permit(:name, :description, :alcoholic, :calories, :photo, :status)
      end
    end
  end
end
