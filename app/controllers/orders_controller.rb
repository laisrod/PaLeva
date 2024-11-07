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

  private

  def order_params
    params.require(:order).permit(:establishment_id, order_items_attributes: [:menu_item_id, :quantity])
  end
end