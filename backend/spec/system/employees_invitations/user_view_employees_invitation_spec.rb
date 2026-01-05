require 'rails_helper'

RSpec.describe 'Visualização de convites de funcionários', type: :system do
  context 'quando acessa a página de convites' do
    it 'e não há convites cadastrados' do    
        # Arrange
        user = User.create!(
          name: 'User',
          email: "user@example.com",
          password: 'testes123456',
          last_name: 'Last Name',
          cpf: '860.392.110-59',
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
          customer_cpf: '860.392.110-59',
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
        password: 'testes123456',
        last_name: 'Last Name',
        cpf: '860.392.110-59',
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
        customer_cpf: '860.392.110-59',
        customer_email: 'customer@example.com',
        customer_name: 'Customer Name'
      )
      employee_invitation = EmployeeInvitation.create!(
        email: 'employee@example.com',
        cpf: '860.392.110-59',
        establishment: establishment,
      )
      # act
      login_as user
      visit establishment_employee_invitations_path(establishment)
      # assert
      expect(page).to have_content 'Convites de Funcionários'
      expect(page).to have_content 'employee@example.com'
      expect(page).to have_content '86039211059'
      expect(page).to have_content 'Pendente'
    end

    it 'e visualiza convite já utilizado' do
      # Arrange
      user = User.create!(
        name: 'User', email: "user@example.com", password: 'testes123456',
        last_name: 'Last Name', cpf: '860.392.110-59', role: true
      )
      establishment = Establishment.create!(
        name: 'Meu Restaurante', social_name: 'Restaurante LTDA',
        cnpj: '39.513.250/0001-60', full_address: 'Rua Principal, 123',
        city: 'São Paulo', state: 'SP', postal_code: '12345-678',
        email: "contato@restaurante.com", phone_number: '11999999999',
        user: user
      )
      employee = User.create!(
        name: 'Employee', email: 'employee@example.com',
        password: 'testes123456', last_name: 'Test',
        cpf: '343.686.820-16',
        role: false
      )
      employee_invitation = EmployeeInvitation.create!(
        email: 'employee@example.com', cpf: '343.686.820-16',
        establishment: establishment
      )

      # Act
      login_as user
      visit establishment_employee_invitations_path(establishment)

      # Assert
      expect(page).to have_content 'employee@example.com'
      expect(page).to have_content '34368682016'
    end
  end
end