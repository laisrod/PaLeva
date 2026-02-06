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