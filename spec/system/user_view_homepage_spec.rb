require 'rails_helper'

describe 'Usuário visita tela inicial' do
  it 'e vê o nome da app' do
    # Arrange
    # Act
    visit '/'	
    # Assert
    expect(page).to have_content('PaLevá')
  end

  it 'e vê os restaurantes cadastrados' do
    # Arrange
    Establishment.create!(name: 'PastoPizza',
                           description: 'Comida Italiana',
                           code: 'PAP',
                           full_address: 'Rua da Pizza, 789',
                           city: 'São Paulo',
                           state: 'SP',
                           postal_code: '34567-890',
                           email: 'contato@pastopizza.com',
                           phone_number: '889222444',
                           opening_hours: '17h às 23h')
    
    Establishment.create!(name: 'Ryori',
                           description: 'Comida Japonesa',
                           code: 'RRY',
                           full_address: 'Rua da Alegria, 123',
                           city: 'São Paulo',
                           state: 'SP',
                           postal_code: '12345-678',
                           email: 'contato@ryori.com',
                           phone_number: '889333777',
                           opening_hours: '13h às 00h')

    Establishment.create!(name: 'Moleskine',
                           description: 'Comida Contemporânea',
                           code: 'MOL',
                           full_address: 'Avenida do Livro, 456',
                           city: 'São Paulo',
                           state: 'SP',
                           postal_code: '23456-789',
                           email: 'contato@moleskine.com',
                           phone_number: '889888555',
                           opening_hours: '15h às 2h')
    
    # Act
    visit '/'	

    # Assert
    expect(page).not_to have_content('Não existem restaurantes cadastrados')
    expect(page).to have_content('PastoPizza')
    expect(page).to have_content('Comida Italiana')
    expect(page).to have_content('889222444')
    expect(page).to have_content('17h às 23h')

    expect(page).to have_content('Ryori')
    expect(page).to have_content('Comida Japonesa')
    expect(page).to have_content('889333777')
    expect(page).to have_content('13h às 00h')

    expect(page).to have_content('Moleskine')
    expect(page).to have_content('Comida Contemporânea')
    expect(page).to have_content('889888555')
    expect(page).to have_content('15h às 2h')
  end

  it 'e vê uma mensagem indicando a ausência de restaurantes' do
    # Arrange
    # Act
    visit('/')
    # Assert
    expect(page).to have_content('Não existem restaurantes cadastrados')
  end
end
