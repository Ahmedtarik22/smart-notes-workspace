# Smart Notes Workspace

Smart Notes Workspace is a full-stack notes application built with React, Express, and MongoDB. It lets users create an account, log in securely, and manage their own notes with search, filters, sorting, and pagination.

## Features

- User registration and login
- JWT authentication with `httpOnly` cookie session
- Protected routes on the frontend
- Notes CRUD for the authenticated user only
- Search, category filter, status filter, sorting, and pagination
- Light and dark theme support
- Form validation on both frontend and backend

## Tech Stack

### Frontend

- React + Vite
- React Router
- Redux Toolkit
- TanStack Query
- React Hook Form + Zod
- Axios

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Zod

## Project Structure

```text
Full stack_React_node_Proj/
|- smart-notes-backend/
`- smart-notes-frontend/
```

## Backend Setup

1. Open the `smart-notes-backend` folder.
2. Create a `.env` file using `.env.example`.
3. Add your environment values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-notes
JWT_SECRET=super_secret_jwt_key_smart_notes_12345
FRONTEND_URL=http://localhost:3000
```

4. Install dependencies:

```bash
npm install
```

5. Start the backend server:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

## Frontend Setup

1. Open the `smart-notes-frontend` folder.
2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

## API Overview

### Auth Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Notes Routes

- `GET /notes`
- `POST /notes`
- `GET /notes/:id`
- `PATCH /notes/:id`
- `DELETE /notes/:id`

## Notes About Authentication

- Authentication uses a JWT stored in an `httpOnly` cookie.
- The frontend sends requests with credentials enabled.
- After successful signup, the user is redirected to the login page.
- After successful login, the session stays active until logout or cookie expiry.

## Testing

### Health Check

Test the backend with:

- `GET http://localhost:5000/health`

### Manual Flow

1. Register a new user from `/register`.
2. Log in from `/login`.
3. Create, edit, view, and delete notes.
4. Test search, filters, sorting, and pagination.
5. Log out and confirm protected pages redirect back to login.

## Postman Collection

A Postman collection is included in:

- `smart-notes-backend/SmartNotes.postman_collection.json`

If you use it, make sure the requests match the current cookie-based auth flow.
