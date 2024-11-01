require 'rails_helper'

describe 'Cadastro de Funcionário' do
  it 'com sucesso' do
    # Arrange
    visit root_path

    # Act
    click_link 'Criar conta'

    expect(page).to have_content('Cadastre-se')
    
    fill_in 'Nome', with: 'Jane'
    fill_in 'Sobrenome', with: 'Doe'
    fill_in 'CPF', with: '529.982.247-25'
    fill_in 'E-mail', with: 'jane@doe.com.br'
    fill_in 'Senha', with: 'password123456'
    fill_in 'Confirmar Senha', with: 'password123456'
    
    click_button 'Cadastrar'

    # Assert
    expect(page).to have_content('Login efetuado com sucesso')
    expect(page).to have_content('jane@doe.com.br')
    expect(page).to have_link('Sair')
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
    # Arrange
    visit root_path

    # Act
    within 'nav' do
      click_link 'Criar conta'
    end

    click_button 'Cadastrar'

    # Assert
    expect(page).to have_content('E-mail não pode ficar em branco')
    expect(page).to have_content('Nome não pode ficar em branco')
    expect(page).to have_content('Sobrenome não pode ficar em branco')
    expect(page).to have_content('CPF não pode ficar em branco')
    expect(page).to have_content('Cpf inválido')

    fill_in 'Nome', with: 'Jane'
    fill_in 'Sobrenome', with: 'Doe'
    fill_in 'CPF', with: '529.982.247-25'
    fill_in 'E-mail', with: 'jane@doe.com.br'
    fill_in 'Senha', with: '123'
    fill_in 'Confirmar Senha', with: '123'

    click_button 'Cadastrar'

    expect(page).to have_content('12 (minimo de caracteres)')
  end
end 