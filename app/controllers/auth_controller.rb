class AuthController < ApplicationController
    before_action :authorize_request, except: :login

    def login
      user = User.find_by(email: params[:email])
  
      if user && user.authenticate(params[:password])
        token = JsonWebToken.encode(user_id: user.id)
        render json: { token: token }, status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end
  
end
  