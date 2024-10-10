class CreateAttachments < ActiveRecord::Migration[7.2]
  def change
    create_table :attachments do |t|
      t.references :journal, null: false, foreign_key: true
      t.string :url

      t.timestamps
    end
  end
end
