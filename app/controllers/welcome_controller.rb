class WelcomeController < ApplicationController
	def index
		@images = Dir.glob("app/assets/images/*")
		@template_images = Dir.glob("app/assets/images/template/*")
	end
end
