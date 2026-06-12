# 🚀 Momentum AI

**Stay consistent. Track your learning. Achieve your goals.**

A full-stack MERN application with AI assistance, daily tracking, note management, and study material storage — built for students and developers preparing for placements.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based Login/Register with bcrypt hashing |
| 📊 Dashboard | Streak stats, motivational quotes, recent activity |
| 📅 Daily Tracker | Log daily learning with streak logic (Duolingo-style) |
| 📝 Notes Hub | Folder-based note system with inline editor |
| 📁 Study Materials | Upload PDF/PPT/DOCX via Cloudinary |
| 🤖 AI Assistant | Gemini-powered chatbot for learning help |
| 👤 Profile | Stats, streak visualization, name editing |

---

## 🛠 Tech Stack

**Frontend:** React.js + Vite, Tailwind CSS, React Router, Axios, React Icons

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose

**Auth:** JWT + bcryptjs

**Storage:** Cloudinary

**AI:** Google Gemini API

**Deploy:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas

---

## 📁 Project Structure

```
momentum-ai/
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, Tracker, Notes, Materials, AIAssistant, Profile, Login, Register
│   │   ├── components/     # Navbar
│   │   ├── context/        # AuthContext (global auth state)
│   │   ├── services/       # api.js (all axios calls)
│   │   └── App.jsx         # Routes
│   └── tailwind.config.js
│
└── backend/
    ├── models/             # User, LearningEntry, Folder, Note, Material, ChatHistory
    ├── controllers/        # auth, user, tracker, folder, note, material, ai
    ├── routes/             # All API routes
    ├── middleware/         # auth.middleware.js (JWT verify)
    ├── config/             # cloudinary.js
    └── server.js           # Entry point
```

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/momentum-ai.git
cd momentum-ai
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/momentum-ai
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/user/profile` | Get profile + stats |
| PUT | `/api/user/profile` | Update name/pic |
| POST | `/api/tracker/create` | Add learning entry |
| PUT | `/api/tracker/update/:id` | Edit entry |
| DELETE | `/api/tracker/delete/:id` | Delete entry |
| GET | `/api/tracker/getall` | All entries + streak |
| POST | `/api/folder/create` | Create folder |
| GET | `/api/folder/getall` | All folders |
| POST | `/api/note/create` | Create note |
| GET | `/api/note/getall` | All notes (optional ?folderId) |
| POST | `/api/material/upload` | Upload file to Cloudinary |
| GET | `/api/material/getall` | All materials |
| POST | `/api/ai/chat` | Send message to Gemini |
| GET | `/api/ai/history` | Get chat history |
| DELETE | `/api/ai/history` | Clear history |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import in Vercel
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

### Backend → Render
1. New Web Service → connect GitHub repo
2. Root directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Add all environment variables
5. Deploy

---

## 🎨 Design System

- **Theme:** Dark with purple accent (#7c3aed)
- **Glassmorphism** cards throughout
- **Smooth hover** effects on all interactive elements
- **Streak visualization** (7-day heatmap + 30-day grid)
- **Fully responsive** mobile design

---

## 🎯 Interview Topics Covered

This project demonstrates:
- ✅ **React** — hooks, context, routing, protected routes
- ✅ **Node.js + Express** — REST API, MVC pattern, middleware
- ✅ **MongoDB** — Mongoose schemas, CRUD, refs, aggregation
- ✅ **Authentication** — JWT, bcrypt, protected routes
- ✅ **File Upload** — Multer + Cloudinary integration
- ✅ **API Integration** — Google Gemini AI
- ✅ **State Management** — Context API
- ✅ **Responsive Design** — Tailwind CSS

---

Built with ❤️ for placement preparation.
