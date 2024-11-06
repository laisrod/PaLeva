class DishesController < ApplicationController
    before_action :set_establishment
    before_action :set_dish, only: [:show, :edit, :update, :destroy, :toggle_status]
  
    def index
      @establishment = Establishment.find(params[:establishment_id])
      @dishes = @establishment.dishes

      if params[:tag_ids].present?
        @dishes = @dishes.joins(:tags)
                        .where(tags: { id: params[:tag_ids] })
                        .distinct
      end
    end
  
    def show
      @portionable = @dish.portions
      @price_histories = PriceHistory.where(portion: @dish.portions)
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
      redirect_to establishment_dishes_path(@establishment), notice: 'O prato foi apagado com sucesso.'
    end
  
    def toggle_status
      @dish.update(status: !@dish.status)
      redirect_to establishment_dish_path(@establishment, @dish), notice: 'Status atualizado com sucesso!'
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
      params.require(:dish).permit(:name, :description, :calories, tag_ids: [], 
                                 tags_attributes: [:name])
    end

  end
  