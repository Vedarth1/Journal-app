class UsersController < ApplicationController
    before_action :authorize_request, except: :create

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
  
    private
    
    def user_params
        params.require(:user).permit(:username, :email, :password).merge(password: params[:password])
    end      
end
  