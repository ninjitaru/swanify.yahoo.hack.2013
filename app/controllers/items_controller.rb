class ItemsController < ApplicationController

    def create
        @item_list = ItemList.find(params[:item_list_id])

        old_item = @item_list.items.find_by_url(params[:url])
        if old_item
            response.status = 400
            render json: {
                :error => "You insert same url item again!"
            }
            return
        end

        @item = @item_list.items.create(item_params)

        if @item.save
            render json: @item
        end
    end

    def destroy
        @item_list = ItemList.find(params[:item_list_id])
        @item = @item_list.items.find(params[:id])
        @item.destroy

        render json: { :message => "Delete item #{params[:id]} success!" }
    end

    private
    def item_params
        params.require(:item).permit!
    end
end
