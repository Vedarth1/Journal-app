class AddViewLaterToJournals < ActiveRecord::Migration[7.2]
  def change
    add_column :journals, :view_later, :boolean, default: false
  end
end
