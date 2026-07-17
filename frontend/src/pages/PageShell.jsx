import React from 'react';
import { NavLink } from 'react-router-dom';
import SchoolLogo from '../components/SchoolLogo';
import './PageShell.css';

const links = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-tachometer-alt' },
  { to: '/admin/students', label: 'Students', icon: 'fa-user-graduate' },
  { to: '/admin/teachers', label: 'Teachers', icon: 'fa-chalkboard-teacher' },
  { to: '/admin/classes', label: 'Classes', icon: 'fa-university' },
  { to: '/admin/subjects', label: 'Subjects', icon: 'fa-book' },
  { to: '/admin/timetable', label: 'Timetable', icon: 'fa-calendar-alt' },
  { to: '/admin/fees', label: 'Fees', icon: 'fa-credit-card' },
  { to: '/admin/reports', label: 'Reports', icon: 'fa-chart-bar' },
  { to: '/admin/feedback', label: 'Feedback Reviews', icon: 'fa-comments' },
  { to: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
];

export default function PageShell({ user, onLogout, title, children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-block">
          <SchoolLogo size={34} showText={true} theme="dark" />
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`fa ${link.icon} admin-link-icon`}></i>
              <span className="admin-link-text">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-content">
        <header className="admin-topbar">
          <div className="topbar-title-block">
            <h2>{title}</h2>
            <p>Signed in as <span className="topbar-username">{user?.name || 'Administrator'}</span></p>
          </div>
          <button className="btn logout-topbar-btn" onClick={onLogout}>
            <i className="fa fa-sign-out-alt"></i> Logout
          </button>
        </header>
        <section className="page-panel">{children}</section>
      </main>
    </div>
  );
}