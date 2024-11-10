class EmployeeInvitation < ApplicationRecord
    belongs_to :establishment
    belongs_to :user, optional: true
    
    validates :email, presence: true, 
                     format: { with: URI::MailTo::EMAIL_REGEXP }
    
    validates :cpf, presence: true,
                   format: { with: /\A\d{11}\z/, message: "deve conter 11 dígitos" }
    
    validates :email, uniqueness: { scope: :establishment_id,
                                  message: "já possui um convite para este estabelecimento" }
    
    validates :cpf, uniqueness: { scope: :establishment_id,
                                message: "já possui um convite para este estabelecimento" }
    
    before_validation :format_cpf
    
    before_save :copy_data_to_user, if: -> { user_id_changed_manually? }
    
    def used?
      user.present?
    end
    
    private
    
    def format_cpf
      self.cpf = cpf.to_s.gsub(/[^\d]/, '') if cpf.present?
    end
    
    def copy_data_to_user
      return unless user.present?
      
      user.update(
        email: email,
        cpf: cpf
      )
    end
    
    def user_id_changed_manually?
      attribute_was("user") != user
  end
end
