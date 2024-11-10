require 'rails_helper'

RSpec.describe 'Visualização de convites de funcionários', type: :system do
  context 'quando acessa a página de convites' do
    it 'e não há convites cadastrados' do    
        # Arrange
        user = User.create!(
          name: 'User',
          email: "user@example.com",
          password: 'password12304050',
          last_name: 'Last Name',
          cpf: '07234197362',
          role: true
        )
        establishment = Establishment.create!(
          name: 'Meu Restaurante',
          social_name: 'Restaurante LTDA',
          cnpj: '39.513.250/0001-60',
          full_address: 'Rua Principal, 123',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '12345-678',
          email: "contato@restaurante.com",
          phone_number: '11999999999',
          user: user
        )
        order = Order.create!(
          establishment: establishment,
          status: :draft,
          customer_cpf: '07234197362',
          customer_email: 'customer@example.com',
          customer_name: 'Customer Name'
        )
      # act
      login_as user
      visit establishment_employee_invitations_path(establishment)
      #assert
      expect(page).to have_content 'Nenhum convite cadastrado'
    end
    it 'e há convites cadastrados' do
      # Arrange
      user = User.create!(
        name: 'User',
        email: "user@example.com",
        password: 'password12304050',
        last_name: 'Last Name',
        cpf: '07234197362',
        role: true
      )
      establishment = Establishment.create!(
        name: 'Meu Restaurante',
        social_name: 'Restaurante LTDA',
        cnpj: '39.513.250/0001-60',
        full_address: 'Rua Principal, 123',
        city: 'São Paulo',
        state: 'SP',
        postal_code: '12345-678',
        email: "contato@restaurante.com",
        phone_number: '11999999999',
        user: user
      )
      order = Order.create!(
        establishment: establishment,
        status: :draft,
        customer_cpf: '07234197362',
        customer_email: 'customer@example.com',
        customer_name: 'Customer Name'
      )
      employee_invitation = EmployeeInvitation.create!(
        email: 'employee@example.com',
        cpf: '07234197362',
        establishment: establishment
      )
      # act
      login_as user
      visit establishment_employee_invitations_path(establishment)
      # assert
      expect(page).to have_content 'Convites de Funcionários'
      expect(page).to have_content 'employee@example.com'
      expect(page).to have_content '07234197362'
      expect(page).to have_content 'Pendente'
    end
  end
end