require "test_helper"

class DrinksControllerTest < ActionDispatch::IntegrationTest
  test "should toggle drink status" do
    establishment = Establishment.create(name: "Test Bar")
    drink = Drink.create(
      name: "Test Drink",
      description: "A test drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment: establishment
    )

    patch toggle_status_establishment_drink_path(establishment, drink)
    
    drink.reload
    assert_equal false, drink.status
    assert_redirected_to establishment_drink_path(establishment, drink)
    assert_equal 'Status atualizado com sucesso!', flash[:notice]
  end

  test "should handle non-existent drink" do
    establishment = Establishment.create(name: "Test Bar")
    
    patch toggle_status_establishment_drink_path(establishment, id: 999)
    
    assert_redirected_to root_path
    assert_equal 'Bebida não encontrada para este estabelecimento.', flash[:alert]
  end
end 