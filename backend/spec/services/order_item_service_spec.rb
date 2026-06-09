require 'rails_helper'

RSpec.describe OrderItemService do
  let(:user) do
    User.create!(
      email: 'owner@example.com',
      password: 'senha@12345678',
      name: 'João',
      last_name: 'Silva',
      cpf: '529.982.247-25'
    )
  end

  let(:establishment) do
    Establishment.create!(
      name: 'Restaurante Teste',
      social_name: 'Restaurante Teste LTDA',
      cnpj: '96.785.019/0001-60',
      full_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'contato@restauranteteste.com',
      phone_number: '11999999999',
      user: user
    )
  end

  let(:dish) do
    Dish.create!(name: 'Frango Grelhado', description: 'Prato saboroso', establishment: establishment)
  end

  let(:portion) do
    Portion.create!(description: 'Individual', price: 25.90, dish: dish)
  end

  let(:menu) do
    Menu.create!(name: 'Cardápio Principal', description: 'Menu de almoço', establishment: establishment)
  end

  let(:menu_item) do
    MenuItem.create!(menu: menu, dish: dish)
  end

  let(:order) do
    Order.create!(establishment: establishment, status: 'draft')
  end

  subject(:service) { described_class.new(order) }

  describe '#add_item' do
    context 'quando os dados são válidos' do
      it 'retorna sucesso' do
        result = service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 2)

        expect(result[:success]).to be true
        expect(result[:message]).to eq('Item adicionado com sucesso!')
      end

      it 'cria um OrderMenuItem no banco' do
        expect {
          service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 2)
        }.to change(OrderMenuItem, :count).by(1)
      end

      it 'retorna o order_menu_item criado' do
        result = service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 2)

        expect(result[:order_menu_item]).to be_a(OrderMenuItem)
        expect(result[:order_menu_item].quantity).to eq(2)
      end

      it 'atualiza o total_price do pedido' do
        service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 2)
        order.reload

        expect(order.total_price).to eq(portion.price * 2)
      end

      it 'executa dentro de uma transaction com lock' do
        expect(order).to receive(:with_lock).and_call_original

        service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 1)
      end
    end

    context 'quando a porção não existe' do
      it 'retorna falha sem criar item' do
        expect {
          result = service.add_item(portion_id: 0, menu_item_id: menu_item.id, quantity: 1)
          expect(result[:success]).to be false
          expect(result[:message]).to eq('Porção não encontrada')
        }.not_to change(OrderMenuItem, :count)
      end
    end

    context 'quando o menu_item não existe' do
      it 'retorna falha sem criar item' do
        expect {
          result = service.add_item(portion_id: portion.id, menu_item_id: 0, quantity: 1)
          expect(result[:success]).to be false
          expect(result[:message]).to eq('Item do cardápio não encontrado')
        }.not_to change(OrderMenuItem, :count)
      end
    end

    context 'quando o pedido está bloqueado por outra transação' do
      it 'retorna falha com mensagem de conflito' do
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        result = service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 1)

        expect(result[:success]).to be false
        expect(result[:message]).to include('Tente novamente')
      end

      it 'não cria nenhum item no banco' do
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        expect {
          service.add_item(portion_id: portion.id, menu_item_id: menu_item.id, quantity: 1)
        }.not_to change(OrderMenuItem, :count)
      end
    end
  end

  describe '#remove_item' do
    let!(:order_menu_item) do
      OrderMenuItem.create!(order: order, menu_item: menu_item, portion: portion, quantity: 1)
    end

    context 'quando o item existe' do
      it 'retorna sucesso' do
        result = service.remove_item(order_menu_item.id)

        expect(result[:success]).to be true
        expect(result[:message]).to eq('Item removido com sucesso!')
      end

      it 'remove o OrderMenuItem do banco' do
        expect {
          service.remove_item(order_menu_item.id)
        }.to change(OrderMenuItem, :count).by(-1)
      end

      it 'executa dentro de uma transaction com lock' do
        expect(order).to receive(:with_lock).and_call_original

        service.remove_item(order_menu_item.id)
      end
    end

    context 'quando o item não pertence ao pedido' do
      it 'retorna falha sem remover nada' do
        expect {
          result = service.remove_item(0)
          expect(result[:success]).to be false
          expect(result[:message]).to eq('Item não encontrado')
        }.not_to change(OrderMenuItem, :count)
      end
    end

    context 'quando o pedido está bloqueado por outra transação' do
      it 'retorna falha com mensagem de conflito' do
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        result = service.remove_item(order_menu_item.id)

        expect(result[:success]).to be false
        expect(result[:message]).to include('Tente novamente')
      end

      it 'não remove nenhum item do banco' do
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        expect {
          service.remove_item(order_menu_item.id)
        }.not_to change(OrderMenuItem, :count)
      end
    end
  end
end
