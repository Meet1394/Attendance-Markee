import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Users, Calendar, BarChart3, CheckCircle, XCircle, Clock, TrendingUp, Home, Save, Plus, Edit2, Trash2, X } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [token, setToken] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendance, setAttendance] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [report, setReport] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState([]);

  const [email, setEmail] = useState('teacher@school.com');
  const [password, setPassword] = useState('teacher123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // New states for add/edit student
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: '', rollNumber: '', class: '' });

  // State for batch save
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedTeacher = localStorage.getItem('teacher');
    if (savedToken && savedTeacher) {
      setToken(savedToken);
      setTeacher(JSON.parse(savedTeacher));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchStudents();
      fetchDashboardStats();
      fetchTodayAttendance();
    }
  }, [isLoggedIn, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setTeacher({ name: data.name, email: data.email });
        setIsLoggedIn(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('teacher', JSON.stringify({ name: data.name, email: data.email }));
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Make sure XAMPP MySQL is running and backend is on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setTeacher(null);
    localStorage.removeItem('token');
    localStorage.removeItem('teacher');
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDashboardStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/attendance/date/${today}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTodayAttendance(data);
    } catch (err) {
      console.error('Error fetching today attendance:', err);
    }
  };

  const markAttendanceLocal = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setHasUnsavedChanges(true);
  };

  const saveAllAttendance = async () => {
    setLoading(true);
    setError('');
    
    try {
      const attendancePromises = Object.entries(attendance).map(([studentId, status]) => 
        fetch(`${API_URL}/attendance/mark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            studentId: parseInt(studentId),
            date: selectedDate,
            status
          })
        })
      );

      await Promise.all(attendancePromises);
      
      setSuccess(`Successfully saved attendance for ${Object.keys(attendance).length} students!`);
      setHasUnsavedChanges(false);
      setTimeout(() => setSuccess(''), 3000);
      fetchDashboardStats();
      fetchTodayAttendance();
    } catch (err) {
      setError('Error saving attendance');
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (studentId) => {
    try {
      const response = await fetch(`${API_URL}/attendance/report/${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setReport(data);
      setSelectedStudent(students.find(s => s.id === studentId));
      setActiveTab('report');
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  };

  const openAddStudentModal = () => {
    setEditingStudent(null);
    setStudentForm({ name: '', rollNumber: '', class: '' });
    setShowStudentModal(true);
  };

  const openEditStudentModal = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      rollNumber: student.rollNumber,
      class: student.class
    });
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setEditingStudent(null);
    setStudentForm({ name: '', rollNumber: '', class: '' });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingStudent 
        ? `${API_URL}/attendance/students/${editingStudent.id}`
        : `${API_URL}/attendance/students`;
      
      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(studentForm)
      });

      if (response.ok) {
        setSuccess(editingStudent ? 'Student updated successfully!' : 'Student added successfully!');
        setTimeout(() => setSuccess(''), 3000);
        closeStudentModal();
        fetchStudents();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save student');
      }
    } catch (err) {
      setError('Error saving student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This will also delete all their attendance records.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/attendance/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSuccess('Student deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchStudents();
      } else {
        setError('Failed to delete student');
      }
    } catch (err) {
      setError('Error deleting student');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Portal</h1>
            <p className="text-gray-600">Student Attendance Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="teacher@school.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? 'Logging in...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center font-semibold mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-700 text-center">Email: teacher@school.com</p>
              <p className="text-xs text-gray-700 text-center">Password: teacher123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md border-b-2 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Attendance Tracker</h1>
              <p className="text-sm text-gray-600">Welcome back, {teacher?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-md font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow">
            <p className="font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap shadow-sm ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('mark')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap shadow-sm ${
              activeTab === 'mark'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap shadow-sm ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            All Students
          </button>
        </div>

        {activeTab === 'dashboard' && dashboardStats && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-600">Total Students</p>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-4xl font-bold text-gray-800">{dashboardStats.totalStudents}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-600">Present Today</p>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-4xl font-bold text-gray-800">{dashboardStats.presentToday}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-600">Absent Today</p>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-4xl font-bold text-gray-800">{dashboardStats.absentToday}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-600">Late Today</p>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-4xl font-bold text-gray-800">{dashboardStats.lateToday}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Overall Attendance</h3>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-bold text-indigo-600">{dashboardStats.overallAttendance}%</p>
                <p className="text-gray-600 mb-2">average attendance rate</p>
              </div>
              <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${dashboardStats.overallAttendance}%` }}
                ></div>
              </div>
            </div>

            {todayAttendance.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance Log</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {todayAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div>
                        <p className="font-semibold text-gray-800">{record.studentName}</p>
                        <p className="text-sm text-gray-600">Roll: {record.rollNumber} | Class: {record.class}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mark' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
              <button
                onClick={saveAllAttendance}
                disabled={!hasUnsavedChanges || loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition shadow-md ${
                  hasUnsavedChanges && !loading
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>

            {hasUnsavedChanges && (
              <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded">
                <p className="font-medium">You have unsaved changes! Click "Save All Changes" to save attendance.</p>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                    <p className="text-sm text-gray-600">Roll: {student.rollNumber} | Class: {student.class}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendanceLocal(student.id, 'present')}
                      className={`px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm ${
                        attendance[student.id] === 'present'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Present
                    </button>
                    <button
                      onClick={() => markAttendanceLocal(student.id, 'absent')}
                      className={`px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm ${
                        attendance[student.id] === 'absent'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      Absent
                    </button>
                    <button
                      onClick={() => markAttendanceLocal(student.id, 'late')}
                      className={`px-5 py-2.5 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm ${
                        attendance[student.id] === 'late'
                          ? 'bg-yellow-600 text-white shadow-md'
                          : 'bg-white text-yellow-600 border-2 border-yellow-600 hover:bg-yellow-50'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Late
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Students ({students.length})</h2>
              <button
                onClick={openAddStudentModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition shadow-md font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add New Student
              </button>
            </div>
            <div className="grid gap-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Roll No: {student.rollNumber} | Class: {student.class}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditStudentModal(student)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition shadow-md font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => viewReport(student.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition shadow-md font-semibold"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Report
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-md font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && report && selectedStudent && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <button
              onClick={() => setActiveTab('students')}
              className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
            >
              ← Back to Students
            </button>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{selectedStudent.name}</h2>
              <p className="text-gray-600">Roll No: {selectedStudent.rollNumber} | Class: {selectedStudent.class}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-green-700 font-semibold mb-1">Present Days</p>
                <p className="text-4xl font-bold text-green-700">{report.totalPresent}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-red-700 font-semibold mb-1">Absent Days</p>
                <p className="text-4xl font-bold text-red-700">{report.totalAbsent}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-sm text-yellow-700 font-semibold mb-1">Late Days</p>
                <p className="text-4xl font-bold text-yellow-700">{report.totalLate}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-blue-700 font-semibold mb-1">Total Days</p>
                <p className="text-4xl font-bold text-blue-700">{report.totalDays}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-sm border-l-4 border-purple-500">
                <p className="text-sm text-purple-700 font-semibold mb-1">Percentage</p>
                <p className="text-4xl font-bold text-purple-700">{report.attendancePercentage}%</p>
              </div>
            </div>

            {report.recentAttendance.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Attendance History</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {report.recentAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {record.remarks && <p className="text-sm text-gray-600 mt-1">Note: {record.remarks}</p>}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={closeStudentModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter student name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                <input
                  type="text"
                  value={studentForm.rollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter roll number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                <input
                  type="text"
                  value={studentForm.class}
                  onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 10-A, 12-Science"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeStudentModal}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;