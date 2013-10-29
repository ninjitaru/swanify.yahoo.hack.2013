class Item < ActiveRecord::Base
    belongs_to  :item_list
    serialize   :images, Array
end
