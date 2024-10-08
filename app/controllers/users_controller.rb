class UsersController < ApplicationController
    def create
      if params[:password] == params[:confirm_password]
        user = User.new(user_params)
        if user.save
          token = encode_token(user_id: user.id)
          render json: { token: token, user: user }, status: :created
        else
          render json: { error: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Password and confirm password do not match' }, status: :unprocessable_entity
      end
    end
  
    private
    
    SECRET_KEY = Rails.application.credentials.secret_key_base

    def user_params
        params.require(:user).permit(:username, :email, :password).merge(password: params[:password])
    end      
  
    def encode_token(payload)
        JWT.encode(payload, SECRET_KEY)
    end
end
  