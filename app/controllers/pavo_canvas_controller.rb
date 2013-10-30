class PavoCanvasController < ApplicationController
    def index
        @canvases = PavoCanva.all
        respond_to do |format|
            format.json { render json: @canvases}
        end
    end

    def show
        @canvas = PavoCanva.find(params[:id])
        respond_to do |format|
            format.json { render json: @canvas }
        end
    end

    def update
        @can = PavoCanva.find(params[:id])

        review = params[:review]
        if review
            @can.objects.each do |object|
                item = object[:canditates][params[:target_item]]
                if item
                    value = item[review]
                    if value.nil?
                        value = 1
                    else
                        value = value + 1
                    end
                    item[review] = value
                end
            end
            if @can.save
                redirect_to @can
            end
        else
            @can.update(pavo_param)
            if @can.save
                redirect_to @can
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
