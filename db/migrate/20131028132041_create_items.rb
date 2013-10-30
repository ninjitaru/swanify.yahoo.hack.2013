class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.timestamps
      t.string      :url
      t.string      :price
      t.text        :images
      t.integer     :item_list_id
    end
  end
end
