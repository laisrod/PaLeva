class MenuItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_establishment!
  before_action :set_menu
  before_action :set_menu_item, only: [:show, :edit, :update, :destroy]

  def index
    @menu_items = @menu.menu_items
  end

  def new
    @menu_item = @menu.menu_items.build
  end

  def create
    @menu_item = @menu.menu_items.build(menu_item_params)

    if @menu_item.save
      redirect_to establishment_menu_path(@establishment, @menu), notice: 'Item adicionado com sucesso.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @menu_item.update(menu_item_params)
      redirect_to establishment_menu_path(@establishment, @menu), notice: 'Item atualizado com sucesso.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @menu_item.destroy
    redirect_to establishment_menu_path(@establishment, @menu), notice: 'Item removido com sucesso.'
  end

  def show
  end
  
  private

  def set_menu
    @establishment = Establishment.find(params[:establishment_id])
    @menu = @establishment.menus.find(params[:menu_id])
  end

  def set_menu_item
    @menu_item = @menu.menu_items.find(params[:id])
  end

  def menu_item_params
    params.require(:menu_item).permit(:menu_id, :dish_id, :drink_id)
  end
end 