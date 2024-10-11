class Journal < ApplicationRecord
  belongs_to :user
  has_many_attached :attachments
  has_many :journal_permissions

  before_create :generate_public_url

  def generate_public_url
    self.public_url = SecureRandom.urlsafe_base64(20)
  end
end
