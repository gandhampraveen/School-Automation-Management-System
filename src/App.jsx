import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import PageShell from './pages/PageShell';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import TeacherManagement from './pages/TeacherManagement';
import ClassManagement from './pages/ClassManagement';
import SubjectManagement from './pages/SubjectManagement';
import Timetable from './pages/Timetable';
import FeeManagement from './pages/FeeManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { api } from './services/api';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('schoolUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('schoolUser');
      }
    }
  }, []);

  const handleLogin = async (identifier, password, userType, setError) => {
    try {
      const authResponse = await api.login({ identifier, password, role: userType });
      const user = {
        ...authResponse.user,
        token: authResponse.token,
      };

      localStorage.setItem('schoolUser', JSON.stringify(user));
      setCurrentUser(user);
      setError('');
    } catch (error) {
      setError(error.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('schoolUser');
    setCurrentUser(null);
  };

  const roleHome = currentUser?.role === 'teacher' ? '/teacher' : currentUser?.role === 'admin' ? '/admin' : '/student';

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to={roleHome} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route
            path="/admin"
            element={
              currentUser?.role === 'admin' ? (
                <PageShell user={currentUser} onLogout={handleLogout} title="Admin Dashboard">
                  <AdminDashboard />
                </PageShell>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/students"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Student Management"><StudentManagement /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/teachers"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Teacher Management"><TeacherManagement /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/classes"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Class Management"><ClassManagement /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/subjects"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Subject Management"><SubjectManagement /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/timetable"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Timetable"><Timetable /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/fees"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Fee Management"><FeeManagement /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/reports"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Reports"><Reports /></PageShell> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/settings"
            element={currentUser?.role === 'admin' ? <PageShell user={currentUser} onLogout={handleLogout} title="Settings"><Settings /></PageShell> : <Navigate to="/login" />}
          />
          <Route 
            path="/student" 
            element={
              currentUser?.role === 'student' ? (
                <StudentDashboard user={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/teacher" 
            element={
              currentUser?.role === 'teacher' ? (
                <TeacherDashboard user={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound user={currentUser} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;