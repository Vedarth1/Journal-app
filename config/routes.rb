Rails.application.routes.draw do
  post '/signup', to: 'users#create' #done
  post '/login', to: 'auth#login' #done
  get '/users/:username',to: 'users#show' #done
  post '/create/journal', to: 'journals#create' #done
  get '/list/journals', to:'journals#index' #done
  delete '/delete/:id', to: 'journals#destroy' #done
  put '/update/:id', to: 'journals#update' #done
  get '/get/journal/:id', to: 'journals#show' #done
  post '/add/attachment', to: 'attachments#create' #done
  delete '/delete/attachments/:id', to:'attachments#destroy' #done
  get '/get/attachments/:journal_id', to: 'attachments#index' #done
  put '/journals/:id/visibility/:visibility', to: 'journals#update_visibility' #done
  get '/journals/:id/public_url', to: 'journals#public_url' 

  get '/journals/public/:public_url', to: 'journals#public_view' #done
  post '/journals/:id/share/:username/:permission', to: 'journals#share'  #done
  get '/sharedjournals/get', to: 'journal_permission#index' #done
  delete '/journals/:id/shareddelete/:username', to: 'journal_permission#destroy' #done
  put '/journals/:id/sharedupdate/:username/:permission', to: 'journal_permission#update_permission' #done
  delete '/journals/:id/revokeshare/:username', to: 'journals#revokeshare'  #done
end