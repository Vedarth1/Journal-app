class JournalPermission < ApplicationRecord
  belongs_to :journal
  belongs_to :user
end
