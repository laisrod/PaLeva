class EstablishmentsController < ApplicationController
  before_action :set_establishment, only: [:edit, :update, :destroy, :search]
  before_action :check_establishment!, only: [:index, :edit, :update, :destroy]

  def index
    @establishment = current_user.establishment
    @working_hours = @establishment.working_hours
  end

  def show
    @establishment = Establishment.find(params[:id])
    if @establishment.user != current_user
      redirect_to root_path, alert: 'Você não tem permissão para ver este estabelecimento.'
    end
  end  

  def new
    @establishment = Establishment.new
  end

  def create
    @establishment = Establishment.new(establishment_params)
    @establishment.user = current_user

    if @establishment.save
      redirect_to root_path, notice: 'Estabelecimento cadastrado com sucesso.'
    else
      flash.now[:notice] = 'Estabelecimento não cadastrado.'
      render 'new'
    end
  end

  def edit; end

  def update
    if @establishment.update(establishment_params)
      redirect_to establishment_path(@establishment.id), notice: 'Estabelecimento atualizado com sucesso.'
    else
      flash.now[:notice] = 'Não foi possivel atualizar o restaurante.'
      render 'edit'
    end
  end

  def destroy
    if @establishment.destroy
      redirect_to root_path, notice: 'Estabelecimento removido com sucesso.'
    else
      redirect_to establishment_path(@establishment), alert: 'Não foi possível remover o estabelecimento.'
    end
  end

  def search
    @establishment = current_user.establishment
    query = params[:query].to_s.strip
    
    @results = if @establishment
      # Search in dishes
      dish_results = @establishment.dishes
                                 .where('LOWER(name) LIKE :query OR LOWER(description) LIKE :query', 
                                       query: "%#{query.downcase}%")
      
      # Search in drinks
      drink_results = @establishment.drinks
                                  .where('LOWER(name) LIKE :query OR LOWER(description) LIKE :query', 
                                        query: "%#{query.downcase}%")
      
      # Combine and sort results
      (dish_results + drink_results).sort_by(&:name)
    else
      []
    end
  end
  
  private

  def establishment_params
    params.require(:establishment).permit(:name, :social_name, :cnpj, :full_address, :city, :state, :postal_code, :email, :phone_number, :state )
  end

  def set_establishment
    @establishment = current_user.establishment
  end
end
