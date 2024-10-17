class JournalPermissionController < ApplicationController
    before_action :authorize_request
    before_action :set_shared_journal, only: [:destroy,:update_permission]

    def index
        shared_journals = JournalPermission.where(user_id: current_user.id)

        render json: {
            shared_journals: shared_journals.map do |permission_record|
                journal = permission_record.journal
                {
                    id: journal.id,
                    title: journal.title,
                    content: journal.content,
                    shared_by: permission_record.shared_by,
                    permission: permission_record.permission
                }
            end
        }, status: :ok
    end

    def destroy
        if @shared_journal
            @shared_journal.destroy
            render json: { message: 'Journal sharing removed successfully' }, status: :ok
        else
            render json: { error: 'Sharing not found for this user' }, status: :not_found
        end
    end

    def update_permission
        if @shared_journal
          if @shared_journal.update(permission: params[:permission])
            render json: { message: 'Permission updated successfully' }, status: :ok
          else
            render json: { error: 'Failed to update permission' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Journal sharing not found' }, status: :not_found
        end
    end

    def sharedjournals
      user = User.find_by(id: current_user.id)
      Rails.logger.info "Current user: #{user.username}"
    
      shared_journals = JournalPermission.where(shared_by: user.username)
      
      render json: {
        shared_journals: shared_journals.map do |permission_record|
          journal = permission_record.journal
          {
            id: journal.id,
            user_id:permission_record.user_id,
            title: journal.title,
            content: journal.content,
            shared_to: permission_record.shared_to,
            permission: permission_record.permission
          }
        end
      }, status: :ok
    end

    def updatesharedjournal
      sharedjournal=Journal.find_by(id: params[:id])
      if sharedjournal.update(journal_params)
      
        render json: { 
          message: "Journal updated successfully.", 
          journal: sharedjournal, 
        }, status: :ok
      else
        render json: { errors: sharedjournal.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def journal_params
      params.require(:journal).permit(:title, :content, :visibility, :view_later)
    end

    def set_shared_journal
        user_to_remove = User.find_by(username: params[:username])
        if user_to_remove
          @shared_journal = JournalPermission.find_by(journal_id: params[:id], user_id: user_to_remove.id)
        else
          @shared_journal = nil
        end
    end
end
