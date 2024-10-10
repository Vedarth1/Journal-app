class JournalsController < ApplicationController
  before_action :authorize_request
  before_action :set_journal, only: [:destroy, :update]
  
  def create
    @journal = Journal.new(journal_params)
    @journal.user_id = current_user.id

    if @journal.save
      if params[:attachments]
        params[:attachments].each do |attachment|
          @journal.attachments.attach(attachment)
        end
      end
      render json: { message: "Journal created successfully", journal: @journal }, status: :created
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
    if @journal.update(journal_params)

      @journal.attachments.purge if params[:attachments].present?
      
      if params[:attachments]
        params[:attachments].each do |attachment|
          @journal.attachments.attach(attachment)
        end
      end
      
      render json: { message: "Journal updated successfully.", journal: @journal }, status: :ok
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

  private

  def set_journal
    @journal = Journal.find_by(id: params[:id], user_id: current_user.id)
  end

  def journal_params
    params.require(:journal).permit(:title, :content, :visibility, :view_later)
  end
end
