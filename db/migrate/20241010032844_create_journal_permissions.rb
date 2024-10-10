class CreateJournalPermissions < ActiveRecord::Migration[7.2]
  def change
    create_table :journal_permissions do |t|
      t.references :journal, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :permission

      t.timestamps
    end
  end
end
