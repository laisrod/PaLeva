class EstablishmentsController < ApplicationController
  def new
    @establishment = Establishment.new
  end

  def index
    @establishments = Establishment.all
  end

  def create
    @establishments = Establishment.new(establishment_params)
    if @establishments.save()
      redirect_to root_path, notice: 'Estabelecimento cadastrado com sucesso.'
    else
      flash.now[:notice] = 'Estabelecimento não cadastrado.'
      render 'new'
    end
  end

  def edit
    @establishment = Establishment.find(params[:id])
  end

  def show
    @establishment = Establishment.find(params[:id])
  end

  def update
    @establishment = Establishment.find(params[:id])
    if @establishment.update(establishment_params)
    redirect_to establishment_path(@establishment.id), notice: 'Restaurante atualizado com sucesso.'
    else
      flash.now[:notice] = 'Não foi possivel atualizar o restaurante.'
      render 'edit'
    end
  end
  
  def employees
    @establishment = Establishment.find(params[:id])
    @employees = @establishment.users
  end
  
  private

  def establishment_params
    params.require(:establishment).permit(:name, :code, :description,
                                          :full_address, :state, :postal_code, 
                                          :email, :phone_number, :opening_hours, :city)
  end
end
