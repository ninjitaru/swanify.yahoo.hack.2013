require 'set'

class PavoCanvasController < ApplicationController
    def index
        @canvases = PavoCanva.all
        respond_to do |format|
            format.json { render json: @canvases}
        end
    end

    def show
        @canvas = PavoCanva.find_by_owner(params[:id])
        @item_list = ItemList.find_by_owner(params[:t])
        @t = params[:t]
        @is_my_canvas = params[:id] == params[:t]

        if @canvas.nil?
            @canvas = PavoCanva.new
            @canvas.owner = params[:id]
            @canvas.template_id = "1"
            @canvas.objects = Array.new

            @item_list.items.each do |item|
                item_json = ActiveSupport::JSON.decode(item.to_json)
                item_json["like"] = Set.new
                item_json["suck"] = Set.new
                item_json["owner"] = params[:id]

                obj = {
                    :cover_item => item.id,
                    :canditates =>
                    {
                        item.id => item_json
                    }
                }
                @canvas.objects.push(obj)
            end

            @canvas.save
        end

        @canvas.objects.each do |obj|
            obj[:canditates].each_value do |canditate|
                unless canditate["like"]
                    canditate["like"] = Set.new
                    canditate["suck"] = Set.new
                end
            end
        end

        @canvas.save
        respond_to do |format|
            format.html {}
            format.json { render json: {
                :canvas => @canvas,
                :item_list => @item_list
                }}
        end
    end

    def destroy
        @can = PavoCanva.find_by_owner(params[:id])
        @can.destroy
        render json: { :message => "Remove #{params[:id]} success!" }
    end

    def update
        @can = PavoCanva.find_by_owner(params[:id])

        review_type = params[:review]
        if review_type
            @can.objects.each do |object|
                item = object[:canditates][params[:target_item]]
                if item
                    review = item[review_type]
                    token = params[:token]
                    if review.include?(token)
                        review.delete(token)
                    else
                        review.add(token)
                    end
                    item[review_type] = review
                end
            end
            if @can.save
                render json: @can
            end
        else
            @can.update(pavo_param)
            if @can.save
                render json: @can
            end
        end
    end

    def create
        @can = PavoCanva.new(pavo_param)
        @can.owner = params[:t]

        if @can.save
            redirect_to @can
        end
    end

    private
    def pavo_param
        params.require(:pavo_canva).permit!
    end
end
