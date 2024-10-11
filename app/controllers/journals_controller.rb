class JournalsController < ApplicationController
  before_action :authorize_request , except: :public_view
  before_action :set_journal, only: [:destroy, :update ,:show, :share]
  
  def create
    @journal = Journal.new(journal_params)
    @journal.user_id = current_user.id
  
    if @journal.save
      uploaded_urls = []
  
      if params[:attachments]
        params[:attachments].each do |attachment|
          uploaded_file = Cloudinary::Uploader.upload(attachment)
          uploaded_urls << uploaded_file['secure_url']
          Attachment.create!(
            journal_id: @journal.id,
            url: uploaded_file['secure_url'],
          )
        end
      end
  
      render json: { 
        message: "Journal created successfully.", 
        journal: @journal, 
        attachments: uploaded_urls 
      }, status: :created
    else
      render json: { errors: @journal.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def index
    @journals = Journal.where(user_id: current_user.id)

    if @journals.any?
      render json: { journals: @journals }, status: :ok
    else
      render json: { message: "No journals found for the user" }, status: :ok
    end
  end

  def update
    uploaded_urls = []
  
    if @journal.update(journal_params)
      if params[:attachments].present?
        Attachment.where(journal_id: @journal.id).delete_all
        
        params[:attachments].each do |attachment|
          uploaded_file = Cloudinary::Uploader.upload(attachment)
          uploaded_urls << uploaded_file['secure_url']
          Attachment.create!(
            journal_id: @journal.id,
            url: uploaded_file['secure_url']
          )
        end
      end
      
      render json: { 
        message: "Journal updated successfully.", 
        journal: @journal, 
        attachments: uploaded_urls 
      }, status: :ok
    else
      render json: { errors: @journal.errors.full_messages }, status: :unprocessable_entity
    end
  end  

  def destroy
    if @journal.nil?
      render json: { error: "No journal." }, status: :not_found
    else
      @journal.destroy
      render json: { message: "Journal deleted successfully" }, status: :no_content
    end
  end

  def show
    render json: @journal, status: :ok
  end

  def public_view
    @journal = Journal.find_by!(public_url: params[:public_url])
    attachments = Attachment.where(journal_id: @journal.id)
  render json: { journal: @journal, attachments: attachments } #read only
  end

  def share
    user_to_share_with = User.find_by(username: params[:username])
    permission = params[:permission] || 'read'
    if user_to_share_with
      existing_permission = JournalPermission.find_by(journal_id: @journal.id, user_id: user_to_share_with.id)

      if existing_permission
        render json: { message: 'journal already shared' }, status: :ok
      else
        @shared_journal = JournalPermission.create(
          journal: @journal,
          user: user_to_share_with,
          permission: permission,
          shared_by: current_user.username
        )
        render json: { message: 'Journal shared successfully' }, status: :ok
      end
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  private

  def set_journal
    @journal = Journal.find_by(id: params[:id], user_id: current_user.id)
  end

  def journal_params
    params.require(:journal).permit(:title, :content, :visibility, :view_later)
  end
end
