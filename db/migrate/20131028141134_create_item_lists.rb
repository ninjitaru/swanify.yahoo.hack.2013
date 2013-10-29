class CreateItemLists < ActiveRecord::Migration
  def change
    create_table :item_lists do |t|
      t.string :owner

      t.timestamps
    end
  end
end
