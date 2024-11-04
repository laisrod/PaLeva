require 'rails_helper'

RSpec.describe DrinksController, type: :controller do
  include Devise::Test::ControllerHelpers

  it "alterna o status da bebida com sucesso" do
    user = User.create!(
      email: "test@example.com",
      password: "password123456",
      password_confirmation: "password123456",
      name: "João",
      last_name: "Silva",
      cpf: "529.982.247-25"
    )
    sign_in user

    establishment = Establishment.create!(
      name: "Test Bar",
      social_name: "Test Bar LTDA",
      cnpj: "61.843.644/0001-36",
      phone_number: "11999999999",
      full_address: "Rua Teste, 123",
      city: "São Paulo",
      state: "SP",
      email: "bar@test.com",
      postal_code: "01234-567",
      user_id: user.id
    )

    drink = Drink.create!(
      name: "Test Drink",
      description: "A test drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment_id: establishment.id
    )

    patch :toggle_status, params: { establishment_id: establishment.id, id: drink.id }
    
    drink.reload
    expect(drink.status).to eq(false)
    expect(response).to redirect_to(establishment_drink_path(establishment, drink))
    expect(flash[:notice]).to eq('Status atualizado com sucesso!')
  end

  it "trata bebida inexistente" do
    user = User.create!(
      email: "test2@example.com",
      password: "password123456",
      password_confirmation: "password123456",
      name: "Maria",
      last_name: "Santos",
      cpf: "752.224.090-58"
    )
    sign_in user

    establishment = Establishment.create!(
      name: 'Establishment', 
      social_name: 'Establishment', 
      cnpj: '47.761.353/0001-78', 
      full_address: '123 Main St', 
      city: 'Anytown', 
      state: 'ST', 
      postal_code: '12345', 
      email: 'establishment9992@example.com', 
      phone_number: '1234567890', 
      user_id: user.id
    )
    
    patch :toggle_status, params: { establishment_id: establishment.id, id: 999 }
    
    expect(response).to redirect_to(root_path)
    expect(flash[:alert]).to eq('Bebida não encontrada para este estabelecimento.')
  end
end 