class AddSharedByToJournalPermission < ActiveRecord::Migration[7.2]
  def change
    add_column :journal_permissions, :shared_by, :string
  end
end
