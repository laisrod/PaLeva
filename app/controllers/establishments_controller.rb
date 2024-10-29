class EstablishmentsController < ApplicationController
  def new
    @establishment = Establishment.new
  end

  def index
    @establishments = Establishment.all
  end

  def create
    @establishment = current_user.build_establishment(establishment_params) # Associa o estabelecimento ao usuário atual
    if @establishment.save()
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
    redirect_to establishment_path(@establishment.id), notice: 'Estabelecimento atualizado com sucesso.'
    else
      flash.now[:notice] = 'Não foi possivel atualizar o restaurante.'
      render 'edit'
    end
  end
  
  def employees
    @establishment = Establishment.find(params[:id])
    @employees = @establishment.users
  end

  def destroy
    @establishment = current_user.build_establishment(establishment_params) # Associa o estabelecimento ao usuário atual
    if @establishment.destroy
      redirect_to root_path, notice: 'Estabelecimento removido com sucesso.'
    else
      redirect_to establishment_path(@establishment), alert: 'Não foi possível remover o estabelecimento.'
    end
  end
  
  private

  def establishment_params
    params.require(:establishment).permit(:name, :description,
                                          :full_address, :state, :postal_code, 
                                          :email, :phone_number, :opening_hours, :city)
  end
end