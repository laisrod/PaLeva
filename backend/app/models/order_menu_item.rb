class OrderMenuItem < ApplicationRecord
  belongs_to :order
  belongs_to :menu_item, optional: true
  belongs_to :portion, optional: true
  belongs_to :menu, optional: true

  validate :menu_or_menu_item_present

  after_create :update_order_total_price
  after_destroy :update_order_total_price

  private

  def menu_or_menu_item_present
    if menu_id.blank? && menu_item_id.blank?
      errors.add(:base, 'Deve ter um menu ou um menu_item')
    end
    
    # Se não é um menu completo, precisa de portion
    if menu_id.blank? && portion_id.blank?
      errors.add(:portion, 'Não é possível adicionar um item sem porção')
    end
  end
  
  def update_order_total_price
    order.update_total_price
    order.save
  end
end
