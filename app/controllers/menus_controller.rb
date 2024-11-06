class MenusController < ApplicationController
  before_action :authenticate_user!
  before_action :set_establishment

  def index
    @menus = @establishment.menus
  end
  
  def new
    @menu = @establishment.menus.build
    @dishes = @establishment.dishes
    @drinks = @establishment.drinks
  end

  def create
    @menu = @establishment.menus.build(menu_params)
    @dishes = Dish.where(id: menu_params[:dish_ids].reject(&:blank?))
    @drinks = Drink.where(id: menu_params[:drink_ids].reject(&:blank?))
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
    @establishment = Establishment.find(params[:establishment_id])
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
    params.require(:menu).permit(:name, :description, dish_ids: [], drink_ids: [])
  end
end 