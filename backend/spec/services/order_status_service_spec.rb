require 'rails_helper'

RSpec.describe OrderStatusService do
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

  def create_order(status:)
    Order.create!(
      establishment: establishment,
      customer_email: 'cliente@example.com',
      customer_phone: '11999999999',
      status: status
    )
  end

  describe '#progress!' do
    context 'transições válidas de status' do
      it 'avança de draft para pending' do
        order = create_order(status: 'draft')
        result = described_class.new(order).progress!

        expect(result[:success]).to be true
        expect(order.reload.status).to eq('pending')
      end

      it 'avança de pending para preparing' do
        order = create_order(status: 'pending')
        result = described_class.new(order).progress!

        expect(result[:success]).to be true
        expect(order.reload.status).to eq('preparing')
      end

      it 'avança de preparing para ready' do
        order = create_order(status: 'preparing')
        result = described_class.new(order).progress!

        expect(result[:success]).to be true
        expect(order.reload.status).to eq('ready')
      end

      it 'avança de ready para delivered' do
        order = create_order(status: 'ready')
        result = described_class.new(order).progress!

        expect(result[:success]).to be true
        expect(order.reload.status).to eq('delivered')
      end
    end

    context 'quando o pedido não pode avançar' do
      it 'retorna falha para pedido já entregue' do
        order = create_order(status: 'delivered')
        result = described_class.new(order).progress!

        expect(result[:success]).to be false
        expect(order.reload.status).to eq('delivered')
      end

      it 'retorna falha para pedido cancelado' do
        order = create_order(status: 'cancelled')
        result = described_class.new(order).progress!

        expect(result[:success]).to be false
        expect(order.reload.status).to eq('cancelled')
      end
    end

    context 'quando o pedido está bloqueado por outra transação' do
      it 'retorna falha com mensagem de conflito' do
        order = create_order(status: 'pending')
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        result = described_class.new(order).progress!

        expect(result[:success]).to be false
        expect(result[:message]).to include('Tente novamente')
      end

      it 'não altera o status do pedido no banco' do
        order = create_order(status: 'pending')
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        described_class.new(order).progress!

        expect(order.reload.status).to eq('pending')
      end
    end

    it 'executa dentro de uma transaction com lock' do
      order = create_order(status: 'draft')
      expect(order).to receive(:with_lock).and_call_original

      described_class.new(order).progress!
    end
  end

  describe '#cancel!' do
    context 'quando o pedido pode ser cancelado' do
      it 'cancela o pedido com sucesso' do
        order = create_order(status: 'pending')
        result = described_class.new(order).cancel!

        expect(result[:success]).to be true
        expect(order.reload.status).to eq('cancelled')
      end

      it 'retorna mensagem de confirmação' do
        order = create_order(status: 'preparing')
        result = described_class.new(order).cancel!

        expect(result[:message]).to eq('Pedido cancelado com sucesso!')
      end
    end

    context 'quando o pedido está bloqueado por outra transação' do
      it 'retorna falha com mensagem de conflito' do
        order = create_order(status: 'pending')
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        result = described_class.new(order).cancel!

        expect(result[:success]).to be false
        expect(result[:message]).to include('Tente novamente')
      end

      it 'não altera o status do pedido no banco' do
        order = create_order(status: 'pending')
        allow(order).to receive(:with_lock).and_raise(ActiveRecord::LockWaitTimeout)

        described_class.new(order).cancel!

        expect(order.reload.status).to eq('pending')
      end
    end

    it 'executa dentro de uma transaction com lock' do
      order = create_order(status: 'draft')
      expect(order).to receive(:with_lock).and_call_original

      described_class.new(order).cancel!
    end
  end
end
