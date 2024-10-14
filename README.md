
# 📒 MindScribe

MindScribe is a full-stack journal application designed to help users document their life with ease. The app allows users to create, manage, and share journal entries, attach media files, and maintain control over their privacy.


## 🌟 Key Features

- Create rich-text journal entries with a featured editor.
- Share journal entries with specific users with controlled     access (read-only or update permissions).
- Keep journals private and visible only to the creator.
- Generate public URLs for anyone to access read-only versions of journal entries.


## 🛠️ Technology Stack

- Backend: Ruby on Rails (API-only mode)
- Frontend: React.js (with Vite as the build tool)
- Authentication: JWT-based authentication
- Database: sqlite3
- File Storage: Cloudinary (for media attachments)
- Deployment: Azure

## FlowDiagram

[MindScribe Flowgraph](https://drive.google.com/file/d/1ZhXjtwE6StxzB-rnYUt9bN8_4redlsQM/view)

## Run Locally

Install Ruby on your local system.

Clone the project

```bash
  git clone https://github.com/Vedarth1/Journal-app
```

Go to the project directory

```bash
  cd Journal-app
```

### Run Backend

Install dependencies

```bash
  bundle install
```

run migrations into your database.

```bash
  rails db:migrate
```

start your backend service

```bash
  rails server
```

### Run Frontend

Go to the client directory

```bash
  cd client
```
Install dependencies

```bash
  npm install
```
Create a .env file in client directory

```bash
VITE_API_BASE_URL=http://127.0.0.1:3000
```

start your frontend service

```bash
  npm run dev
```
