import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { api } from './services/api';

const navItems = [
  { to: '/admin', label: 'Admin' },
  { to: '/students', label: 'Students' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/marks', label: 'Marks' },
  { to: '/timetable', label: 'Timetable' },
  { to: '/fees', label: 'Fees' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

function Layout({ children, user, onLogout }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>School Automation</h1>
        <p>Frontend</p>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <strong>{user?.name || 'Guest'}</strong>
            <p>{user?.role || 'Not signed in'}</p>
          </div>
          <button onClick={onLogout}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

function Login({ onLogin }) {
  const [role, setRole] = useState('student');
  const [identifier, setIdentifier] = useState('1001');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await onLogin({ identifier, password, role });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-card">
      <h1>School Automation</h1>
      <p>Sign in to continue</p>
      <form onSubmit={submit}>
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Username / Roll No / Teacher ID" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('frontendUser');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('frontendUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('frontendUser');
    }
  }, [user]);

  const homePath = useMemo(() => (user?.role === 'admin' ? '/admin' : '/students'), [user]);

  const handleLogin = async (credentials) => {
    const result = await api.login(credentials);
    setUser({ ...result.user, token: result.token });
  };

  const handleLogout = () => setUser(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={homePath} /> : <Login onLogin={handleLogin} />} />
        <Route path="/admin" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Admin Dashboard" description="Full admin workspace ready for backend data." /></Layout> : <Navigate to="/login" />} />
        <Route path="/students" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Student Management" description="Connect student CRUD endpoints here." /></Layout> : <Navigate to="/login" />} />
        <Route path="/teachers" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Teacher Management" description="Teacher list and assignments live here." /></Layout> : <Navigate to="/login" />} />
        <Route path="/attendance" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Attendance" description="Attendance monitoring and entry screen." /></Layout> : <Navigate to="/login" />} />
        <Route path="/marks" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Marks" description="Marks management and grading views." /></Layout> : <Navigate to="/login" />} />
        <Route path="/timetable" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Timetable" description="Weekly schedule view." /></Layout> : <Navigate to="/login" />} />
        <Route path="/fees" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Fee Management" description="Fees, dues, and receipts." /></Layout> : <Navigate to="/login" />} />
        <Route path="/reports" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Reports" description="Analytics and summaries." /></Layout> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Layout user={user} onLogout={handleLogout}><PlaceholderPage title="Settings" description="System configuration." /></Layout> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? homePath : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}
