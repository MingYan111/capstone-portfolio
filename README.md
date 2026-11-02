# Capstone Project: Full-Stack Portfolio & Blog Application

**Course:** Web Data Management and Application  
**Project Type:** Cumulative Full-Stack Capstone Project  
**Total Marks:** 100  
**Student:** Dong Mingyan  
**Student ID:** 24998066  

---

## 1. Project Overview

This capstone project is a complete, production-ready **Full-Stack Personal Portfolio Website**. It consists of two core components:

### 1.1 The Back-End API

A secure, robust, and scalable RESTful API built with **Node.js and Express**. It acts as the "brain" of the portfolio, managing:

- **Projects** — portfolio items shown on the site
- **Skills** — the technologies and competencies displayed
- **Contact messages** — messages sent through the contact form
- **Blog API** — a full-featured blog with **user authentication** (JWT) and **comments**

Data is modeled with **Mongoose** and stored in a cloud-hosted **MongoDB Atlas** database.

### 1.2 The Front-End SPA

A modern **Single Page Application (SPA) built with React**. It consumes all of the back-end endpoints and provides:

- A multi-page user experience with **React Router**
- Global state management with the **Context API**
- Complete **authentication flows** (register / login / logout)
- A secure **Admin Dashboard** to manage portfolio and blog content

---

## 2. Live Deployment Links

| Component | Link |
|---|---|
| Front-End (React SPA) | `https://gregarious-sprite-94a8c9.netlify.app` |
| Back-End API (Node.js/Express) | `https://dreamy-halva-73e31c.netlify.app` |

> Admin login (live): email `admin@example.com`, password `admin123456`

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Back-End | Node.js, Express, Mongoose (ODM) |
| Database | MongoDB Atlas (cloud-hosted) |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Front-End | React 18, Vite, React Router v6, Axios |

---

## 4. Project Structure

```
CapstoneProject/
├── README.md
├── package.json                # Root helper: npm start -> node server/server.js
├── server/                     # Back-End API
│   ├── server.js               # Local entry point (connect + listen)
│   ├── app.js                  # Express app (routes, CORS, error handling)
│   ├── seed.js                 # Seed script (admin + demo content)
│   ├── package.json
│   ├── .env.example            # Environment variable template
│   ├── netlify.toml            # Netlify function + redirect config
│   ├── netlify/
│   │   └── functions/
│   │       └── index.js        # serverless-http wrapper (waits for DB)
│   ├── api/index.js            # Optional Vercel serverless adapter (reference only)
│   ├── vercel.json             # Optional Vercel config (reference only)
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   ├── Message.js
│   │   ├── BlogPost.js
│   │   └── Comment.js
│   └── routes/
│       ├── auth.js
│       ├── projects.js
│       ├── skills.js
│       ├── messages.js
│       ├── posts.js
│       └── comments.js
└── client/                     # Front-End SPA
    ├── package.json
    ├── vite.config.js          # Dev proxy: /api -> localhost:5000
    ├── index.html
    ├── .env.example            # VITE_API_URL template
    └── src/
        ├── main.jsx
        ├── App.jsx             # Routes
        ├── index.css           # Global styles & theme
        ├── api/client.js       # Axios instance + token interceptor
        ├── context/AuthContext.jsx
        ├── components/         # Navbar, Footer, ProjectCard, ProtectedRoute, Loading
        └── pages/              # Home, Projects, Blog, BlogPostDetail, Contact,
                                # Login, Register, Admin, NotFound
```

---

## 5. API Documentation

Base URL (local): `http://localhost:5000` — all routes are prefixed with `/api`.  
Base URL (live): `https://dreamy-halva-73e31c.netlify.app`

### 5.1 Authentication

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user | `{ username: string, email: string, password: string (min 6), name?: string }` |
| POST | `/api/auth/login` | Public | Login and receive a JWT | `{ email: string, password: string }` → returns `{ token, user }` |
| GET | `/api/auth/me` | Private (Bearer token) | Get the current user | — |

### 5.2 Projects

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| GET | `/api/projects` | Public | List all projects | Query: `?featured=true` filters featured projects |
| GET | `/api/projects/:id` | Public | Get one project | `:id` — project ObjectId |
| POST | `/api/projects` | Admin | Create a project | `{ title*, description*, image?, link?, github?, technologies?: string[], featured?: boolean }` |
| PUT | `/api/projects/:id` | Admin | Update a project | Same fields as POST (partial allowed) |
| DELETE | `/api/projects/:id` | Admin | Delete a project | — |

### 5.3 Skills

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| GET | `/api/skills` | Public | List all skills | — |
| POST | `/api/skills` | Admin | Create a skill | `{ name*, category?, level?: 1-100, icon? }` |
| PUT | `/api/skills/:id` | Admin | Update a skill | Same fields as POST (partial allowed) |
| DELETE | `/api/skills/:id` | Admin | Delete a skill | — |

### 5.4 Contact Messages

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| POST | `/api/messages` | Public | Send a contact message | `{ name*, email*, subject?, message* }` |
| GET | `/api/messages` | Admin | List all messages (newest first) | — |
| PUT | `/api/messages/:id/read` | Admin | Mark a message as read | — |
| DELETE | `/api/messages/:id` | Admin | Delete a message | — |

### 5.5 Blog Posts

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| GET | `/api/posts` | Public | List published posts | Query: `?published=false` (admin) returns all |
| GET | `/api/posts/:id` | Public | Get one post (by `_id` or slug) | `:id` — ObjectId or slug |
| POST | `/api/posts` | Admin | Create a post | `{ title*, content*, slug?, excerpt?, cover?, tags?: string[], published?: boolean, author? }` |
| PUT | `/api/posts/:id` | Admin | Update a post | Same fields as POST (partial allowed) |
| DELETE | `/api/posts/:id` | Admin | Delete a post | — |

### 5.6 Comments

| Method | Endpoint | Access | Purpose | Body / Params |
|---|---|---|---|---|
| GET | `/api/posts/:postId/comments` | Public | List comments of a post | `:postId` — post ObjectId |
| POST | `/api/posts/:postId/comments` | Public | Add a comment | `{ name*, email?, content* }` |
| DELETE | `/api/comments/:id` | Admin | Delete a comment | — |

> **Authentication:** Protected routes require an `Authorization: Bearer <token>` header. Admin routes additionally require the user to have `isAdmin: true`.

---

## 6. How to Run Locally

### Prerequisites

- Node.js **18+** and npm installed
- A MongoDB Atlas account (free tier) — or a local MongoDB instance

### 6.1 Set Up the Back-End

```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

Edit `.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=<a long random string>
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123456
CLIENT_URL=http://localhost:5173
```

Create the admin account and optional demo content:

```bash
npm run seed
```

Start the API server:

```bash
npm start
# or: npm run dev
```

The API will run at `http://localhost:5000`.

### 6.2 Set Up the Front-End

```bash
cd client
npm install
npm run dev
```

The SPA will run at `http://localhost:5173`. In development, the Vite dev server proxies `/api` requests to `http://localhost:5000` (see `vite.config.js`), so **no extra configuration is needed**.

### 6.3 Logging In as Admin

Use the admin credentials you set in `server/.env` (defaults from the seed script):

- Email: `admin@example.com`
- Password: `admin123456`

Log in at `http://localhost:5173/login`, then open **Admin** in the navigation bar.

---

## 7. Deployment Guide

### 7.1 Deploy the Database (MongoDB Atlas)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and add your IP (or `0.0.0.0/0`) to the network access whitelist.
3. Copy the connection string and put it into `MONGODB_URI`.

### 7.2 Deploy the Back-End (Netlify Functions)

The back-end runs as a Netlify Function via the `serverless-http` wrapper (see `server/netlify.toml` and `server/netlify/functions/index.js`).

1. Push the repository to GitHub.
2. On Netlify choose **Add new site → Import an existing project → GitHub**, and select the repository.
3. Set **Base directory** to `server`. Build and publish directories are not used — requests are routed to the function by the redirect rule in `netlify.toml`.
4. In **Environment variables**, add every variable from `server/.env.example` (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`).
   - Use the **direct (non-SRV) connection string** for `MONGODB_URI` (port 27017, `tls=true`), e.g.
     `mongodb://<user>:<pass>@ac-xxx-shard-00-00.<cluster>.mongodb.net:27017,ac-xxx-shard-00-01.<cluster>.mongodb.net:27017,ac-xxx-shard-00-02.<cluster>.mongodb.net:27017/portfolio?replicaSet=atlas-xxxx-shard-0&retryWrites=true&authSource=admin&tls=true`
5. Deploy the site, then open **Project configuration → Visitor access → Edit visibility** and set **Production** to **Public** so anyone can access the API.
6. The function waits for the MongoDB connection before serving requests, so cold starts are handled correctly. When the front-end URL changes, update `CLIENT_URL` (comma-separated for multiple origins) and trigger a new deploy.

### 7.3 Deploy the Front-End (Netlify)

Option A — Git import (auto build):

1. **Add new site → Import an existing project → GitHub** and select the same repository.
2. Set **Base directory** to `client`, **Build command** to `npm run build`, **Publish directory** to `dist`.
3. Add the environment variable `VITE_API_URL` = your back-end URL (e.g. `https://dreamy-halva-73e31c.netlify.app`).
4. Deploy, then set the site visibility to **Public** (Project configuration → Visitor access).

Option B — Netlify Drop (manual upload, what this project used):

1. Build locally with the back-end URL injected:
   ```bash
   cd client
   npm install
   VITE_API_URL=https://dreamy-halva-73e31c.netlify.app npm run build
   ```
2. Drag and drop the generated `client/dist` folder onto the Netlify dashboard.
3. Set the site visibility to **Public**.

After deployment, make sure the back-end `CLIENT_URL` includes the front-end URL (otherwise the browser will be blocked by CORS), then trigger a new back-end deploy.

---

## 8. Features Checklist

- [x] RESTful API (Express) with clear resource separation
- [x] MongoDB Atlas data modeling with Mongoose
- [x] JWT user authentication (register / login / protected routes)
- [x] Admin-only dashboard routes
- [x] Portfolio projects & skills management (CRUD)
- [x] Contact message form + admin inbox
- [x] Full blog with comments (public read / post, admin delete)
- [x] React SPA: routing, global state, auth flows
- [x] Responsive dark-themed UI
- [x] Seed script for demo content & admin account
