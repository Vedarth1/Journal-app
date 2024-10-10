class UsersController < ApplicationController
    before_action :authorize_request, except: :create
    before_action :find_user, only: [:show]

    def create
      if params[:password] == params[:confirm_password]
        user = User.new(user_params)
        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: { token: token, user: user }, status: :created
        else
          render json: { error: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Password and confirm password do not match' }, status: :unprocessable_entity
      end
    end

    def show
      if @user
        render json: @user, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end
  
    private
    def find_user
      @user = User.find_by_username(params[:username])
      rescue ActiveRecord::RecordNotFound
        render json: { errors: 'User not found' }, status: :not_found
    end

    def user_params
        params.require(:user).permit(:username, :email, :password).merge(password: params[:password])
    end      
end
  