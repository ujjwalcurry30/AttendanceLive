# Employee Attendance Management App

A full-stack web application to manage employee attendance with punch in/out functionality, authentication, and a modern interactive UI.

---

## Features
- Employee registration and login (email, username, password)
- JWT-based authentication
- Punch In/Out attendance system
- Live attendance list
- Modern, responsive React frontend
- MongoDB database

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas)

---

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Attendance
```

---

## 2. Backend Setup

### a. Install Dependencies
```bash
cd backend
npm install
```

### b. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your_jwt_secret_here
PORT=5000
```
- Replace `your_jwt_secret_here` with a random string.
- If using MongoDB Atlas, use your Atlas connection string for `MONGO_URI`.

### c. Start MongoDB
- Make sure MongoDB is running locally, or your Atlas cluster is online.

### d. Start the Backend Server
```bash
node index.js
```
- You should see `MongoDB connected` and `Server running on port 5000`.

---

## 3. Frontend Setup

### a. Install Dependencies
```bash
cd ../
npm install
```

### b. Start the Frontend Dev Server
```bash
npm run dev
```
- The app will be available at `http://localhost:5173`

---

## 4. Usage

1. **Register** a new employee account.
2. **Login** with your credentials.
3. **Punch In/Out** to mark attendance.
4. **View** the live attendance list.

---

## 5. Project Structure
```
Attendance/
├── backend/
│   ├── index.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── .env
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── pages/
│   │   ├── Login.jsx / Login.css
│   │   ├── Register.jsx / Register.css
│   │   └── Dashboard.jsx / Dashboard.css
│   └── ...
├── package.json
└── README.md
```

---

## 6. Troubleshooting
- **Registration failed:** Ensure MongoDB is running and the email/username is unique.
- **API errors:** Check backend terminal for errors and verify `.env` settings.
- **Frontend not loading:** Make sure both backend and frontend servers are running.

---

## 7. Customization
- Update styles in `src/App.css` and page-specific CSS files.
- Backend logic can be extended in `backend/controllers/` and `backend/routes/`.

---

## 8. License
MIT
