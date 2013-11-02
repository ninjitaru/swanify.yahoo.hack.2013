class PavoCanvasController < ApplicationController
    def index
        @canvases = PavoCanva.all
        respond_to do |format|
            format.json { render json: @canvases}
        end
    end

    def show
        @canvas = PavoCanva.find_by_owner(params[:id])
        @item_list = ItemList.find_by_owner(params[:id])

        if @canvas.nil?
            @canvas = PavoCanva.new
            @canvas.owner = params[:id]
            @canvas.template_id = "1"
            @canvas.objects = Array.new

            @item_list.items.each do |item|
                obj = {
                    :cover_item => item.id,
                    :canditates =>
                    {
                        item.id => item
                    }
                }
                @canvas.objects.push(obj)
            end

            @canvas.save
        end

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
        @can = PavoCanva.find(params[:id])

        review = params[:review]
        if review
            logger.debug "#{@can.inspect}"
            @can.objects.each do |object|
                item = object[:canditates][params[:target_item]]
                if item
                    value = item[review]
                    logger.debug "old value: #{value}"
                    if value.nil?
                        value = 1
                    else
                        value = value + 1
                    end
                    logger.debug "new value: #{value}"
                    item[review] = value
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
