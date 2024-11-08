class OrdersController < ApplicationController
  def index
    @orders = Order.all
  end

  def new
    @establishment = Establishment.find(params[:establishment_id])
    @order = @establishment.orders.build
    @menu_items = MenuItem.where(menu_id: params[:menu])
  end

  def create
    @order = Order.new(order_params)
    
    if @order.save
      params[:menu_items]&.each do |menu_item_id, quantity|
        next if quantity.to_i <= 0
        
        menu_item = MenuItem.find(menu_item_id)
        @order.add_item(menu_item, quantity.to_i)
      end
      
      redirect_to @order, notice: 'Pedido criado com sucesso!'
    else
      @menu_items = MenuItem.where(establishment_id: params[:establishment_id])
      render :new
    end
  end

  def update
    @order = Order.find(params[:id])
    @order.update(order_params)
    redirect_to establishment_order_path(@order.establishment, @order)
  end

  def show
    @order = Order.find(params[:id])
  end

  def add_item
    @order = current_order
    @establishment = @order.establishment
    @menu_item = MenuItem.find(params[:menu_item_id])
    @order_menu_item = @order.order_menu_items.build
  end

  def save_item
    @order = current_order
    @order_menu_item = @order.order_menu_items.build(order_menu_item_params)
    @order_menu_item.save!
    redirect_to establishment_order_path(@order.establishment, @order)
  end

  def remove_item
    @order = current_order
    @order_menu_item = @order.order_menu_items.find(params[:item_id])
    @order_menu_item.destroy
    redirect_to establishment_order_path(@order.establishment, @order)
  end

  private

  def order_params
    params.require(:order).permit(:establishment_id, order_items_attributes: [:menu_item_id, :quantity])
  end

  def order_menu_item_params
    params.require(:order_menu_item).permit(:portion_id, :menu_item_id, :quantity)
  end

  def order_params
    params.require(:order).permit(:customer_name, :customer_email, :customer_cpf)
  end
end
