class TagsController < ApplicationController
  include Authorizable

  before_action :check_establishment!
  before_action :set_establishment, only: [:new, :create, :edit, :update, :destroy]
  before_action :authorize_owner!, only: [:new, :create, :edit, :update, :destroy]

  def index
    @tags = Tag.all.page(params[:page]).per(20)
    @establishment = Establishment.find(params[:establishment_id])
  end

  def new
    @tag = Tag.new
    @establishment = Establishment.find(params[:establishment_id])
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      redirect_to establishment_tags_path(@establishment), notice: 'Característica criada com sucesso'
    else
      render :new, notice: 'Característica não criada erros: ' + @tag.errors.full_messages.join(', ')
    end
  end

  def edit
    @tag = Tag.find(params[:id])
    @establishment = Establishment.find(params[:establishment_id])
  end

  def update
    @tag = Tag.find(params[:id])
    if @tag.update(tag_params)
      redirect_to establishment_tags_path(@establishment), notice: 'Característica atualizada com sucesso'
    else
      render :edit, notice: 'Característica não atualizada'
    end
  end

  def show
    @tag = Tag.find(params[:id])
    @establishment = Establishment.find(params[:establishment_id])
  end

  def destroy
    @tag = Tag.find(params[:id])
    @tag.destroy
    redirect_to establishment_tags_path(@establishment)
  end

  private

  def tag_params
    params.require(:tag).permit(:name)
  end

  def set_establishment
    @establishment = Establishment.find(params[:establishment_id])
  end
end