class PavoCanva < ActiveRecord::Base
    serialize   :objects, Array
end
