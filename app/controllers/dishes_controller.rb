class DishesController < ApplicationController
    before_action :set_establishment
    before_action :set_dish, only: [:show, :edit, :update, :destroy]
  
    def index
      @dishes = @establishment.dishes
    end
  
    def show
      @dish = Dish.find(params[:id])
    end
  
    def new
      @dish = @establishment.dishes.build
    end
  
    def create
      @dish = @establishment.dishes.build(dish_params)
      if @dish.save
        redirect_to establishment_dish_path(@establishment, @dish), notice: 'O prato foi criado com sucesso.'
      else
        render :new
      end
    end
  
    def edit
    end
  
    def update
      if @dish.update(dish_params)
        redirect_to establishment_dish_path(@establishment, @dish), notice: 'O prato foi atualizado com sucesso.'
      else
        render :edit
      end
    end
  
    def destroy
      @dish.destroy
      redirect_to dishes_url, notice: 'O prato foi apagado com sucesso.'
    end
  
    private
  
    def set_establishment
      @establishment = Establishment.find(params[:establishment_id])
    end
  
    def set_dish
      @dish = @establishment.dishes.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to root_path, alert: 'Prato não encontrado neste estabelecimento.'
    end
  
    def dish_params
      params.require(:dish).permit(:name, :description, :calories, :photo)
    end
  end
  