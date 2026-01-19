module CodeGeneratable
  extend ActiveSupport::Concern

  included do
    before_create :generate_code
  end

  private

  def generate_code
    loop do
      new_code = SecureRandom.hex(8)
      unless self.class.where(code: new_code).exists?
        self.code = new_code
        break
      end
    end
  end
end

