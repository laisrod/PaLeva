module Web
  module Establishments
    class PortionsController < ApplicationController
      include Authorizable

      before_action :check_establishment!
      before_action :set_establishment
      before_action :authorize_owner!, only: [:new, :create, :edit, :update, :destroy]

      def new
        @portionable = params[:dish_id] ? @dish = Dish.find(params[:dish_id]) : @drink = Drink.find(params[:drink_id])
        @portion = @portionable.portions.build
      end

      def edit
        @portionable = params[:dish_id] ? @dish = Dish.find(params[:dish_id]) : @drink = Drink.find(params[:drink_id])
        @portion = @portionable.portions.find(params[:id])
      end

      def create
        @portionable = params[:dish_id] ? @dish = Dish.find(params[:dish_id]) : @drink = Drink.find(params[:drink_id])
        @portion = @portionable.portions.build(portion_params)
        
        if @portion.save
          redirect_to [@establishment, @portionable], notice: 'Novo preço registrado com sucesso.'
        else
          render :new, status: :unprocessable_entity
        end
      end

      def update
        @portionable = params[:dish_id] ? @dish = Dish.find(params[:dish_id]) : @drink = Drink.find(params[:drink_id])
        @portion = @portionable.portions.find(params[:id])

        if @portion.update(portion_params)
          redirect_to [@establishment, @portionable], notice: 'Porção atualizada com sucesso.'
        else
          render :edit, status: :unprocessable_entity
        end
      end

      def destroy
        @portionable = params[:dish_id] ? @dish = Dish.find(params[:dish_id]) : @drink = Drink.find(params[:drink_id])
        @portion = @portionable.portions.find(params[:id])
        
        @portion.price_histories.destroy_all if @portion.respond_to?(:price_histories)
        @portion.destroy
        
        redirect_path = if @portionable.is_a?(Dish)
                         establishment_dish_path(@establishment, @portionable)
                       else
                         establishment_drink_path(@establishment, @portionable)
                       end
        
        redirect_to redirect_path, notice: 'Porção removida com sucesso.'
      end

      private

      def set_establishment
        @establishment = Establishment.find(params[:establishment_id])
      end

      def portion_params
        params.require(:portion).permit(:description, :price)
      end
    end
  end
end
