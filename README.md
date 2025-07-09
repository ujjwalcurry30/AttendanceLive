# Employee Attendance Management App

A full-stack web application to manage employee attendance with punch in/out functionality, authentication, and a modern interactive UI.

---

## Features
- Employee registration and login (email, username, password)
- JWT-based authentication
- Punch In/Out attendance system
- Live attendance list
- **Late Arrivals and Early Leaves reports** (with date selection)
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
- You should see `MongoDB connected` and `Server running on port 6060`.

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
5. **Check Late Arrivals and Early Leaves reports**:
   - Use the date picker at the top of the dashboard to select a date.
   - The "Late Arrivals" report shows employees who punched in after 9:00 AM.
   - The "Early Leaves" report shows employees who punched out before 6:00 PM.

---

## Late Arrivals & Early Leaves Reports

- **Late Arrivals:** Employees who punch in after 9:00 AM are listed here for the selected date.
- **Early Leaves:** Employees who punch out before 6:00 PM are listed here for the selected date.
- Use the date picker on the dashboard to view reports for any day.

---

## 5. Project Structure
```