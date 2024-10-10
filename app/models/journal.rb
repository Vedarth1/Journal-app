class Journal < ApplicationRecord
  belongs_to :user
  has_many_attached :attachments
  has_many :journal_permissions
end
