class Journal < ApplicationRecord
  belongs_to :user
  has_many_attached :attachments, dependent: :destroy
  has_many :journal_permissions, dependent: :destroy

  before_create :generate_public_url

  def generate_public_url
    self.public_url = SecureRandom.urlsafe_base64(20)
  end
end
