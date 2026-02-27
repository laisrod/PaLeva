# Conta de proprietário (owner)
owner = User.find_or_initialize_by(email: 'owner@example.com')
if owner.new_record?
  owner.assign_attributes(
    name: 'Owner',
    password: 'testes123456',
    password_confirmation: 'testes123456',
    last_name: 'Last',
    cpf: '529.982.247-25',
    role: true
  )
  owner.save!
  puts "✓ Conta de proprietário criada: owner@example.com"
else
  puts "✓ Conta de proprietário já existe: owner@example.com"
end

# Conta de cliente de teste
client = User.find_or_initialize_by(email: 'client@example.com')
if client.new_record?
  client.assign_attributes(
    name: 'Cliente',
    password: 'testes123456',
    password_confirmation: 'testes123456',
    last_name: 'Teste',
    cpf: '074.926.422-53',
    role: false
  )
  client.save!
  puts "✓ Conta de cliente criada: client@example.com"
else
  puts "✓ Conta de cliente já existe: client@example.com"
end

# Estabelecimento de teste (para o owner)
owner.reload
if owner.persisted? && owner.establishment.nil?
  establishment = Establishment.find_or_initialize_by(cnpj: '67.204.530/0001-22')
  if establishment.new_record?
    establishment.assign_attributes(
      name: 'Restaurante Teste',
      social_name: 'Restaurante Teste LTDA',
      full_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'restaurante@teste.com',
      phone_number: '(11) 98765-4321',
      user: owner
    )
    establishment.save!
    puts "✓ Estabelecimento criado: #{establishment.name} (Código: #{establishment.code})"
  else
    puts "✓ Estabelecimento já existe: #{establishment.name} (Código: #{establishment.code})"
  end
end

# Produtos de cafeteria para testes
owner.reload
establishment = owner.establishment

if establishment.present?
  puts "→ Cadastrando produtos de cafeteria para #{establishment.name}..."

  dish_tags = {
    'Doce' => Tag.find_or_create_by!(name: 'Doce', category: 'dish'),
    'Salgado' => Tag.find_or_create_by!(name: 'Salgado', category: 'dish'),
    'Vegetariano' => Tag.find_or_create_by!(name: 'Vegetariano', category: 'dish')
  }

  drink_tags = {
    'Café' => Tag.find_or_create_by!(name: 'Café', category: 'drink'),
    'Gelada' => Tag.find_or_create_by!(name: 'Gelada', category: 'drink'),
    'Sem Álcool' => Tag.find_or_create_by!(name: 'Sem Álcool', category: 'drink')
  }

  dishes_data = [
    {
      name: 'Pão de Queijo',
      description: 'Porção tradicional de pão de queijo assado na hora.',
      calories: 320,
      tags: ['Salgado', 'Vegetariano'],
      portions: [
        { description: '6 unidades', price: 12.90 },
        { description: '12 unidades', price: 22.90 }
      ]
    },
    {
      name: 'Croissant de Presunto e Queijo',
      description: 'Croissant amanteigado recheado com presunto e queijo.',
      calories: 410,
      tags: ['Salgado'],
      portions: [
        { description: 'Unidade', price: 14.90 }
      ]
    },
    {
      name: 'Bolo de Cenoura com Calda',
      description: 'Fatia de bolo de cenoura com cobertura de chocolate.',
      calories: 360,
      tags: ['Doce', 'Vegetariano'],
      portions: [
        { description: 'Fatia', price: 11.90 }
      ]
    },
    {
      name: 'Cookie de Chocolate',
      description: 'Cookie artesanal de chocolate meio amargo.',
      calories: 280,
      tags: ['Doce'],
      portions: [
        { description: 'Unidade', price: 8.90 },
        { description: 'Combo 3 unidades', price: 24.90 }
      ]
    }
  ]

  drinks_data = [
    {
      name: 'Espresso',
      description: 'Café espresso intenso com crema.',
      alcoholic: false,
      calories: 5,
      tags: ['Café', 'Sem Álcool'],
      portions: [
        { description: '50ml', price: 6.90 },
        { description: 'Duplo 100ml', price: 9.90 }
      ]
    },
    {
      name: 'Cappuccino',
      description: 'Café espresso com leite vaporizado e canela.',
      alcoholic: false,
      calories: 160,
      tags: ['Café', 'Sem Álcool'],
      portions: [
        { description: '200ml', price: 12.90 },
        { description: '300ml', price: 15.90 }
      ]
    },
    {
      name: 'Latte Gelado',
      description: 'Café com leite gelado e gelo.',
      alcoholic: false,
      calories: 130,
      tags: ['Café', 'Gelada', 'Sem Álcool'],
      portions: [
        { description: '300ml', price: 14.90 }
      ]
    },
    {
      name: 'Chá Gelado de Pêssego',
      description: 'Chá preto gelado sabor pêssego, sem álcool.',
      alcoholic: false,
      calories: 95,
      tags: ['Gelada', 'Sem Álcool'],
      portions: [
        { description: '300ml', price: 10.90 },
        { description: '500ml', price: 14.90 }
      ]
    }
  ]

  seeded_dishes = dishes_data.map do |dish_data|
    dish = Dish.find_or_initialize_by(establishment: establishment, name: dish_data[:name])
    dish.description = dish_data[:description]
    dish.calories = dish_data[:calories]
    dish.status = true
    dish.save!

    dish_data[:tags].each do |tag_name|
      tag = dish_tags.fetch(tag_name)
      dish.tags << tag unless dish.tags.include?(tag)
    end

    dish_data[:portions].each do |portion_data|
      portion = Portion.find_or_initialize_by(dish: dish, description: portion_data[:description])
      portion.price = portion_data[:price]
      portion.save!
    end

    dish
  end

  seeded_drinks = drinks_data.map do |drink_data|
    drink = Drink.find_or_initialize_by(establishment: establishment, name: drink_data[:name])
    drink.description = drink_data[:description]
    drink.alcoholic = drink_data[:alcoholic]
    drink.calories = drink_data[:calories]
    drink.status = true
    drink.save!

    drink_data[:tags].each do |tag_name|
      tag = drink_tags.fetch(tag_name)
      drink.tags << tag unless drink.tags.include?(tag)
    end

    drink_data[:portions].each do |portion_data|
      portion = Portion.find_or_initialize_by(drink: drink, description: portion_data[:description])
      portion.price = portion_data[:price]
      portion.save!
    end

    drink
  end

  cafe_menu = Menu.find_or_initialize_by(establishment: establishment, name: 'Café da Manhã')
  cafe_menu.description = 'Seleção de produtos de cafeteria para começar o dia.'
  cafe_menu.active = true
  cafe_menu.price = 39.90
  cafe_menu.save!

  (seeded_dishes.first(2) + seeded_drinks.first(2)).each do |item|
    menu_item = if item.is_a?(Dish)
                  MenuItem.find_or_create_by!(menu: cafe_menu, dish: item)
                else
                  MenuItem.find_or_create_by!(menu: cafe_menu, drink: item)
                end

    # Vincula a primeira porção disponível para facilitar testes de criação de pedido
    first_portion = item.portions.order(:created_at).first
    MenuItemPortion.find_or_create_by!(menu_item: menu_item, portion: first_portion) if first_portion.present?
  end

  puts "✓ Produtos de cafeteria cadastrados: #{seeded_dishes.count} pratos, #{seeded_drinks.count} bebidas e menu '#{cafe_menu.name}'."
else
  puts '⚠ Não foi possível cadastrar produtos de cafeteria: owner sem estabelecimento.'
end