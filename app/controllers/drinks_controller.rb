class DrinksController < ApplicationController
    before_action :set_establishment
    before_action :set_drink, only: [:show, :edit, :update, :destroy]
  
    def index
      @drinks = @establishment.drinks
    end
  
    def show
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
        redirect_to establishment_drink_path(@establishment, @drink), notice: 'Drink was successfully updated.'
      else
        render :edit
      end
    end
  
    def destroy
        @drink.destroy
        redirect_to establishment_drinks_path(@establishment), notice: 'Drink was successfully destroyed.'
      end
      
  
    private
  
    def set_establishment
      @establishment = Establishment.find(params[:establishment_id])
    end
  
    def set_drink
      @drink = @establishment.drinks.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to root_path, alert: 'Drink not found for this establishment.'
    end
  
    def drink_params
      params.require(:drink).permit(:name, :description, :alcoholic, :calories, :photo)
    end
  end
  