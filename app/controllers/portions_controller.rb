class PortionsController < ApplicationController

  def new
    puts "Params received: #{params.inspect}"  # Debug line
    @portionable = params[:dish_id] ? Dish.find(params[:dish_id]) : Drink.find(params[:drink_id])
    @portion = @portionable.portions.build
  end

  def edit
    @portionable = params[:dish_id] ? Dish.find(params[:dish_id]) : Drink.find(params[:drink_id])
    @portion = @portionable.portions.find(params[:id])
  end

  def create
    @portionable = params[:dish_id] ? Dish.find(params[:dish_id]) : Drink.find(params[:drink_id])
    @portion = @portionable.portions.build(portion_params)

    if @portion.save
      redirect_to @portionable, notice: 'Porção criada com sucesso.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    @portionable = params[:dish_id] ? Dish.find(params[:dish_id]) : Drink.find(params[:drink_id])
    @portion = @portionable.portions.find(params[:id])
    if @portion.update(portion_params)
      redirect_to @portionable, notice: 'Porção atualizada com sucesso.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @portionable = params[:dish_id] ? Dish.find(params[:dish_id]) : Drink.find(params[:drink_id])
    @portion = @portionable.portions.find(params[:id])
    @portion.destroy
    redirect_to @portionable, notice: 'Porção removida com sucesso.'
  end


  private

  def portion_params
    params.require(:portion).permit(:description, :price, :dish_id, :drink_id)
  end
end 