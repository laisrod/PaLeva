require 'rails_helper'

RSpec.describe User, type: :model do
  it 'é válido com atributos válidos' do
    user = User.new(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    expect(user).to be_valid
  end

  it 'não é válido sem um nome' do
    user = User.new(
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    expect(user).not_to be_valid
  end

  it 'não é válido sem um email' do
    user = User.new(
      name: 'Usuário', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    expect(user).not_to be_valid
  end

  it 'não é válido sem uma senha' do
    user = User.new(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    expect(user).not_to be_valid
  end
end