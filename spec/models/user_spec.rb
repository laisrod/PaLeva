require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is valid with valid attributes' do
    user = User.new(name: 'Usuário Teste', email: 'usuario@teste.com', password_digest: '123456')
    expect(user).to be_valid
  end

  it 'is not valid without a name' do
    user = User.new(email: 'usuario@teste.com', password_digest: '123456')
    expect(user).not_to be_valid
  end
  it 'is not valid without a email' do
    user = User.new(name: 'Usuário Teste', password_digest: '123456')
    expect(user).not_to be_valid
  end

  it 'is not valid without a password' do
    user = User.new(name: 'Usuário Teste', email: 'usuario@teste.com')
    expect(user).not_to be_valid
  end
end