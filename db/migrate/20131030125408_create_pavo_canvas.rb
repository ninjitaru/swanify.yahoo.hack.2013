class CreatePavoCanvas < ActiveRecord::Migration
  def change
    create_table :pavo_canvas do |t|

      t.timestamps
      t.string      :template_id
      t.string      :owner
      t.text        :objects
    end
  end
end
