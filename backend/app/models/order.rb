class Order < ApplicationRecord
  include CodeGeneratable
  include Statusable
  include OrderBroadcastable

  belongs_to :establishment
  belongs_to :user, optional: true
  has_many :order_menu_items, dependent: :destroy
  has_many :menu_items, through: :order_menu_items
  
  before_save :reset_timestamps
  before_save :update_total_price, unless: :destroyed?

  validate :validate_contact_info, on: :update, if: :should_validate_contact_info?
  validate :validate_cpf, if: -> { customer_cpf.present? }

  enum status: {
    draft: "draft",
    pending: "pending",
    preparing: "preparing",
    ready: "ready",
    delivered: "delivered",
    cancelled: "cancelled"
  }

  attr_accessor :cancellation_reason

  scope :recent, -> { order(created_at: :desc) }
  scope :by_establishment, ->(establishment) { where(establishment: establishment) }

  def next_status(cancel = false)
    return 'cancelled' if cancel
    case status
    when 'draft' then 'pending'
    when 'pending' then 'preparing'
    when 'preparing' then 'ready'
    when 'ready' then 'delivered'
    end
  end

  def can_progress?
    !['delivered', 'cancelled'].include?(status)
  end

  def update_total_price
    self.total_price = order_menu_items.sum do |order_item|
      begin
        # Se o order_item tem menu_id direto, usar o preço do menu
        if order_item.menu_id
          menu = Menu.find_by(id: order_item.menu_id)
          if menu&.price
            menu.price * (order_item.quantity || 0)
          else
            0
          end
        # Caso contrário, usar o preço da porção (para itens adicionados diretamente)
        elsif order_item.portion&.price
          order_item.portion.price * (order_item.quantity || 0)
        else
          0
        end
      rescue => e
        Rails.logger.error "Erro ao calcular preço do item #{order_item.id}: #{e.message}"
        0
      end
    end
  end

  private

  def reset_timestamps
    if status_changed? && status_was == 'draft' && status != 'draft'
      self.created_at = DateTime.now
      self.updated_at = DateTime.now
    end
  end

  def should_validate_contact_info?
    # Validar apenas quando o status está mudando de 'draft' para outro status
    status_changed? && status_was == 'draft' && status != 'draft'
  end

  def validate_contact_info
    if customer_email.blank? && customer_phone.blank?
      errors.add(:base, 'É necessário informar um telefone ou email para confirmar o pedido')
    end
  end

  def validate_cpf
    if customer_cpf.present? && !CPF.valid?(customer_cpf)
      errors.add(:customer_cpf, "inválido")
    end
  end
end