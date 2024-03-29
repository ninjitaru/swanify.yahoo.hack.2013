class ItemListsController < ApplicationController
    skip_before_filter :authenticate_user!
    def index
        @item_lists = ItemList.all
        respond_to do |format|
            format.json { render json: @item_lists}
        end
    end

    def show
        @item_list = ItemList.find_by_owner(params[:id])
        if @item_list.nil?
            @item_list = ItemList.new
            @item_list.owner = params[:id]
            @item_list.save
        end
        respond_to do |format|
            format.json { render json: @item_list }
        end
    end

    def create
        @item_list = ItemList.new
        @item_list.owner = params[:t]

        if @item_list.save
            redirect_to @item_list
        end
    end

    def destroy
        @item_list = ItemList.find_by_owner(params[:id])
        @item_list.destroy
        render json: { :message => "Remove success!" }
    end
end
