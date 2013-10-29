class ItemsController < ApplicationController

    def create
        @item_list = ItemList.find(params[:item_list_id])
        @item = @item_list.items.create(item_params)

        if @item.save
            render json: @item
        end
    end

    private
    def item_params
        params.require(:item).permit!
    end
end
