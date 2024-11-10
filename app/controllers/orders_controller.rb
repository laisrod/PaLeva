class OrdersController < ApplicationController
  def index
    @orders = Order.all
  end

  def update
    @order = Order.find(params[:id])
    if @order.update(order_params)
      redirect_to establishment_order_path(@order.establishment, @order), notice: 'Pedido atualizado com sucesso'
    else
      flash.now[:alert] = @order.errors.full_messages.join(', ')
      render :show, status: :unprocessable_entity
    end
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

  def change_status
    @order = Order.find(params[:id])
    
    if @order.can_progress?
      @order.update_attribute(:status, @order.next_status)
      @order.update_total_price
      notice = case @order.status
               when 'pending' then 'Pedido enviado para a cozinha!'
               when 'preparing' then 'Pedido em preparação!'
               when 'ready' then 'Pedido pronto!'
               when 'delivered' then 'Pedido entregue!'
               end
      redirect_to establishment_order_path(@order.establishment, @order), notice: notice
    else
      redirect_to establishment_order_path(@order.establishment, @order), 
                  alert: 'Não é possível alterar o status deste pedido.'
    end
  end

  def cancel
    @order = Order.find(params[:id])
    @order.update_attribute(:status, 'cancelled')
    redirect_to establishment_order_path(@order.establishment, @order), notice: 'Pedido cancelado com sucesso!'
  end

  private

  def order_params
    params.require(:order).permit(
      :customer_name,
      :customer_email,
      :customer_cpf,
      :customer_phone
    )
  end

  def order_menu_item_params
    params.require(:order_menu_item).permit(:portion_id, :menu_item_id, :quantity)
  end
end
