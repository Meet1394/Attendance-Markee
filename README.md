# 📚 Student Attendance Management System

A full-stack web application for managing student attendance built with React, .NET Core, and MySQL (XAMPP).

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![MySQL](https://img.shields.io/badge/MySQL-XAMPP-4479A1?logo=mysql)

## ✨ Features

- 🔐 Secure teacher authentication with JWT
- 📊 Real-time dashboard with attendance statistics
- ✅ Batch attendance marking (mark all, save once)
- 👥 Student management (Add, Edit, Delete)
- 📈 Individual student attendance reports
- 🎨 Beautiful responsive UI with Tailwind CSS

---

## 🚀 Quick Setup Guide

### Step 1: Download Required Software

Download and install these in order:

1. **XAMPP** - https://www.apachefriends.org/
2. **Node.js** - https://nodejs.org/ (v18 or higher)
3. **.NET SDK** - https://dotnet.microsoft.com/download (v8.0 or higher)
4. **Git** - https://git-scm.com/

### Step 2: Clone the Repository

```bash
git clone https://github.com/yourusername/attendance-tracker.git](https://github.com/Meet1394/Attendance-Markee.git
cd attendance-tracker
```

### Step 3: Setup Database (XAMPP)

#### 3.1 Start XAMPP Services
1. Open **XAMPP Control Panel** (Run as Administrator on Windows)
2. Click **"Start"** for **Apache**
3. Click **"Start"** for **MySQL**
4. Both should show **green** status

#### 3.2 Create Database
1. Open browser and go to: **http://localhost/phpmyadmin**
2. Click **"New"** in left sidebar
3. Database name: **`attendance_db`**
4. Collation: **`utf8mb4_general_ci`**
5. Click **"Create"**

#### 3.3 Import Database
1. Click on **`attendance_db`** in left sidebar
2. Click **"Import"** tab at top
3. Click **"Choose File"**
4. Select **`attendance_db.sql`** from the project folder
5. Click **"Go"** at bottom
6. Wait for success message ✅

#### 3.4 Verify Import
- You should see 3 tables: `teachers`, `students`, `attendance`
- Click on each table and "Browse" to see sample data

### Step 4: Setup Backend (.NET API)

```bash
# Navigate to backend folder
cd AttendanceTracker

# Restore packages
dotnet restore

# Run the backend
dotnet run
```

**Backend will start on:** `http://localhost:5000`

✅ You should see: `Now listening on: http://localhost:5000`

### Step 5: Setup Frontend (React)

Open a **NEW terminal** (keep backend running), then:

```bash
# Navigate to frontend folder
cd  attendance-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will start on:** `http://localhost:5173`

✅ Browser should open automatically to the login page

### Step 6: Login

Open browser and go to: **http://localhost:5173**

Use these credentials:
- **Email:** `teacher@school.com`
- **Password:** `teacher123`

---

## ⚙️ Configuration

### Backend Configuration

**File:** `backend/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=attendance_db;User=root;Password=;Port=3306;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
  }
}
```

**XAMPP MySQL Defaults:**
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: (empty/blank)


## 🎯 How to Use

### Dashboard
- View total students count
- See today's attendance stats
- Check overall attendance percentage

### Mark Attendance
1. Select date
2. Click Present/Absent/Late for each student
3. Click **"Save All Changes"** button
4. Done! ✅

### Manage Students
1. Go to **"All Students"** tab
2. **Add:** Click "Add New Student" button
3. **Edit:** Click "Edit" button on any student
4. **Delete:** Click "Delete" button (asks for confirmation)
5. **Report:** Click "Report" to see detailed attendance

---


## 🔑 Demo Accounts

### Teachers (Login Credentials)

| Email | Password | Name |
|-------|----------|------|
| teacher@school.com | teacher123 | Demo Teacher |
| john.doe@school.com | password123 | John Doe |
| jane.smith@school.com | password123 | Jane Smith |

### Students (Pre-loaded)
- 14 demo students in classes 10-A and 10-B
- Sample attendance records included

---

## 🛠️ Tech Stack

**Frontend:**
- React 18.x + Vite
- Tailwind CSS
- Lucide React Icons

**Backend:**
- ASP.NET Core 8.0
- C# 
- JWT Authentication
- MySQL Connector

**Database:**
- MySQL (via XAMPP)
- phpMyAdmin

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Teacher login

### Students
- `GET /api/attendance/students` - Get all students
- `POST /api/attendance/students` - Add new student
- `PUT /api/attendance/students/{id}` - Update student
- `DELETE /api/attendance/students/{id}` - Delete student

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/date/{date}` - Get attendance by date
- `GET /api/attendance/report/{studentId}` - Get student report
- `GET /api/attendance/dashboard` - Get dashboard stats

All endpoints (except login) require JWT token in Authorization header.

---

## 🎓 Development

### Start Development
```bash
# Terminal 1 - Backend
cd AttendanceTracker
dotnet watch run

# Terminal 2 - Frontend  
cd attendance-frontend
npm run dev
```

### Build for Production
```bash
# Backend
cd AttendanceTracker
dotnet publish -c Release

# Frontend
cd attendance-frontend
npm run build
```

---
Note: You have To Click On Split Terminal If You Are Using VS Code and Then run backend and frontend Simultaneously 

## 📦 What's Included

✅ Complete source code (Frontend + Backend)  
✅ Database schema with sample data (`attendance_db.sql`)  
✅ 3 demo teacher accounts  
✅ 14 demo students  
✅ Sample attendance records  
✅ All features working out of the box  

---

## 🚨 Important Notes

⚠️ **XAMPP is for development only** - Don't use in production  
⚠️ **Change default passwords** before deploying  
⚠️ **Set MySQL password** in XAMPP for better security  
⚠️ **Keep XAMPP services running** while developing  

---

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Mark Attendance
![Attendance](screenshots/attendance.png)

### Student Management
![Students](screenshots/students.png)

*(Add screenshots in a `screenshots` folder in your repo)*

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

---

## 📄 License

MIT License - feel free to use this project for learning or production.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## ⭐ Support

If this project helped you, please give it a ⭐ on GitHub!

---

## 📞 Need Help?

1. Check the **Common Issues** section above
2. Open an issue on GitHub
3. Include error messages and screenshots

---

**Made with ❤️ using React, .NET Core, and MySQL**

*Last Updated: October 26, 2025*
