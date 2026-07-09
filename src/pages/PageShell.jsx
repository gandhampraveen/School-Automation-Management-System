import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/teachers', label: 'Teachers' },
  { to: '/admin/classes', label: 'Classes' },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/timetable', label: 'Timetable' },
  { to: '/admin/fees', label: 'Fees' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function PageShell({ user, onLogout, title, children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-block">
          <h1>School Automation</h1>
          <p>Full Stack Management</p>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-content">
        <header className="admin-topbar">
          <div>
            <h2>{title}</h2>
            <p>Signed in as {user?.name || 'Administrator'}</p>
          </div>
          <button className="btn btn-danger" onClick={onLogout}>Logout</button>
        </header>
        <section className="page-panel">{children}</section>
      </main>
    </div>
  );
}