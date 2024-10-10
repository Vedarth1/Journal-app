Rails.application.routes.draw do
  post '/signup', to: 'users#create' #done
  post '/login', to: 'auth#login' #done
  get '/users/:username',to: 'users#show' #done
  post '/create/journal', to: 'journals#create' #done
  get '/list/journals', to:'journals#index' #done
  delete '/delete/:id', to: 'journals#destroy' #done
  put '/update/:id', to: 'journals#update' #done
  get '/get/journal/:id', to: 'journals#show' 
  post '/add/attachment', to: 'attachments#create' #done
  delete '/delete/attachments/:id', to:'attachments#destroy' #done
  get '/get/attachments/:journal_id', to: 'attachments#index' #done
end