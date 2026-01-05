require 'rails_helper'

RSpec.describe Tag, type: :model do
  describe 'validações' do
    it 'nome é obrigatório' do
      tag = Tag.new(name: '')
      expect(tag).not_to be_valid
      expect(tag.errors[:name]).to include('não pode ficar em branco')
    end

    it 'nome deve ser único' do
      Tag.create!(name: 'Vegano')
      tag = Tag.new(name: 'Vegano')
      expect(tag).not_to be_valid
      expect(tag.errors[:name]).to include('já está em uso')
    end
  end
end
