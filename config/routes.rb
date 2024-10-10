Rails.application.routes.draw do
  post '/signup', to: 'users#create' #done
  post '/login', to: 'auth#login' #done
  get '/users/:username',to: 'users#show' #done
  post '/create/journal', to: 'journals#create' #done
  get '/list/journals', to:'journals#index' #done
  delete '/delete/:id', to: 'journals#destroy' #done
  put '/update/:id', to: 'journals#update' #done
end