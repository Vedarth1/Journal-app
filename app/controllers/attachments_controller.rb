class AttachmentsController < ApplicationController
    before_action :authorize_request

    def create
        journal = Journal.find(params[:journal_id])
        if params[:attachments].present?
            uploaded_attachments = []
            params[:attachments].each do |attachment|
                uploaded_file = Cloudinary::Uploader.upload(attachment)
        
                attachment_record = Attachment.create!(
                    journal_id: journal.id,
                    url: uploaded_file['secure_url'],
                    created_at: Time.now,
                    updated_at: Time.now
                )

                uploaded_attachments << attachment_record
            end
            render json: {
                message: 'Attachments uploaded successfully.',
                attachments: uploaded_attachments
            }, status: :created    
        else
            render json: { errors: 'No attachments provided' }, status: :unprocessable_entity
        end
    end

    def index
        attachments = Attachment.where(journal_id: params[:journal_id])
    
        if attachments.any?
          render json: attachments, status: :ok
        else
          render json: { message: 'No attachments found for this journal.' }, status: :not_found
        end
    end

    def destroy
        attachment = Attachment.find(params[:id])
        if attachment.destroy
          render json: { message: 'Attachment deleted successfully.' }, status: :no_content
        else
          render json: { errors: attachment.errors.full_messages }, status: :unprocessable_entity
        end
    end
end
