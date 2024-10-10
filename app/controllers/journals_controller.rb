class JournalsController < ApplicationController
  
    def create
      journal = @current_user.journals.new(journal_params)
  
      if journal.save
        if params[:attachments]
          params[:attachments].each do |attachment|
            journal.attachments.attach(attachment)
          end
        end
  
        render json: { message: "Journal created successfully", journal: journal }, status: :created
      else
        render json: { errors: journal.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def journal_params
      params.require(:journal).permit(:title, :content, :visibility)
    end
end