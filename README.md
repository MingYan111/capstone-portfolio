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

> ⚠️ Replace the placeholders below with the real URLs after deploying.

| Component | Link |
|---|---|
| Front-End (e.g., Vercel / Netlify) | `https://your-portfolio.vercel.app` |
| Back-End API (e.g., Render / Heroku) | `https://your-api.onrender.com` |

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
├── server/                     # Back-End API
│   ├── server.js               # Express app entry point
│   ├── seed.js                 # Seed script (admin + demo content)
│   ├── package.json
│   ├── .env.example            # Environment variable template
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
2. Create a database user and add your IP to the network access whitelist.
3. Copy the connection string and put it into `MONGODB_URI`.

### 7.2 Deploy the Back-End (Render / Heroku)

1. Create a new **Web Service** from the `server` folder.
2. Set the environment variables (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_*`, `CLIENT_URL`).
3. Build command: `npm install` — Start command: `npm start`.
4. After deployment, run `npm run seed` (one-off job) to create the admin account.

### 7.3 Deploy the Front-End (Vercel / Netlify)

1. In the `client` folder create a `.env` file (or set it in the platform dashboard):
   ```env
   VITE_API_URL=https://your-api.onrender.com
   ```
2. Build command: `npm install && npm run build` — Output directory: `dist`.
3. After deployment, update `CLIENT_URL` on the back-end to the front-end URL and **restart the back-end service**.

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
