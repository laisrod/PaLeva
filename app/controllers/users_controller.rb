class UsersController < ApplicationController
  def new
    @user = User.new()
    @establishments = Establishment.all
  end

  def create
    @user = User.new(user_params)
    if @user.save()
      redirect_to root_path, notice: 'Funcionário cadastrado com sucesso.'
    else
      flash.now[:notice] = 'Funcionário não cadastrado.'
      render 'new'
    end
  end

  def show
    @user = User.find(params[:id])
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password_digest, :role)
  end
end
