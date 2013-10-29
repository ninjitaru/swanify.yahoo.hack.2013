class ItemList < ActiveRecord::Base
    has_many :items

    def as_json(options = {})
        json = super(options)
        json[:items] = items
        json
    end
end
