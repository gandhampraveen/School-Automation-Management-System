import React from 'react';
import { Link } from 'react-router-dom';
import SchoolLogo from '../components/SchoolLogo';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Dynamic Header / Navbar */}
      <header className="landing-navbar">
        <div className="nav-logo">
          <SchoolLogo size={42} showText={true} theme="light" />
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Statistics</a>
          <a href="#about">About</a>
        </nav>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-outline-light">
            <i className="fa fa-sign-in"></i> Sign In
          </Link>
          <Link to="/register" className="btn btn-gold">
            <i className="fa fa-user-plus"></i> Join Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-wrapper">
            <span className="hero-badge">School Automation Portal</span>
          </div>
          <h1>Empowering Education Through Intelligent Automation</h1>
          <p>
            Welcome to the digital gateway of <strong>A.A.N.M & V.V.R.S.R Gudlavalleru School</strong>. 
            A robust full-stack solution connecting students, teachers, and administrators 
            with real-time metrics, automated schedules, grades, and profile management.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-hero-primary">
              <i className="fa fa-graduation-cap"></i> Access Dashboards
            </Link>
            <Link to="/register" className="btn btn-hero-secondary">
              <i className="fa fa-arrow-right"></i> Register Account
            </Link>
          </div>
        </div>
        
        {/* Floating cards to simulate dashboard preview */}
        <div className="hero-preview-cards">
          <div className="preview-card p-card-1">
            <div className="p-card-header">
              <i className="fa fa-chart-line"></i>
              <span>Live Attendance</span>
            </div>
            <div className="p-card-body">
              <h3>98.4%</h3>
              <p>Weekly Class Average</p>
            </div>
          </div>
          <div className="preview-card p-card-2">
            <div className="p-card-header">
              <i className="fa fa-user-graduate"></i>
              <span>Active Students</span>
            </div>
            <div className="p-card-body">
              <h3>1,200+</h3>
              <p>Across 24 Classes</p>
            </div>
          </div>
          <div className="preview-card p-card-3">
            <div className="p-card-header">
              <i className="fa fa-book-reader"></i>
              <span>Subjects Taught</span>
            </div>
            <div className="p-card-body">
              <h3>18+</h3>
              <p>Structured Curriculums</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick Overview */}
      <section id="stats" className="stats-section">
        <div className="stat-box">
          <div className="stat-circle">
            <i className="fa fa-users"></i>
          </div>
          <h3>1,200+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat-box">
          <div className="stat-circle">
            <i className="fa fa-chalkboard-teacher"></i>
          </div>
          <h3>75+</h3>
          <p>Expert Instructors</p>
        </div>
        <div className="stat-box">
          <div className="stat-circle">
            <i className="fa fa-university"></i>
          </div>
          <h3>24+</h3>
          <p>Managed Classes</p>
        </div>
        <div className="stat-box">
          <div className="stat-circle">
            <i className="fa fa-percent"></i>
          </div>
          <h3>98.5%</h3>
          <p>Satisfaction Rating</p>
        </div>
      </section>

      {/* Roles & Modules Feature grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>One Portal, Three Tailored Dashboards</h2>
          <p>Experience role-based features designed specifically to streamline school operations.</p>
        </div>
        <div className="features-grid">
          
          {/* Student Panel */}
          <div className="feature-card">
            <div className="feature-icon fi-student">
              <i className="fa fa-user-graduate"></i>
            </div>
            <h3>Student Dashboard</h3>
            <p>
              Access grades instantly, trace monthly attendance charts, check assignments 
              status and lookup timetables in one simple responsive portal.
            </p>
            <ul>
              <li><i className="fa fa-check-circle"></i> View Attendance records</li>
              <li><i className="fa fa-check-circle"></i> Download Unit Marksheets</li>
              <li><i className="fa fa-check-circle"></i> Weekly timetable schedules</li>
            </ul>
          </div>

          {/* Teacher Panel */}
          <div className="feature-card">
            <div className="feature-icon fi-teacher">
              <i className="fa fa-chalkboard-teacher"></i>
            </div>
            <h3>Teacher Dashboard</h3>
            <p>
              Mark student daily attendance records, add subject marks, manage homework 
              assignments and evaluate individual student performance stats.
            </p>
            <ul>
              <li><i className="fa fa-check-circle"></i> Easy attendance checklists</li>
              <li><i className="fa fa-check-circle"></i> Subject marks management</li>
              <li><i className="fa fa-check-circle"></i> Manage class reports</li>
            </ul>
          </div>

          {/* Admin Panel */}
          <div className="feature-card">
            <div className="feature-icon fi-admin">
              <i className="fa fa-user-shield"></i>
            </div>
            <h3>Admin Console</h3>
            <p>
              Oversee the school system, manage student and teacher registers, define 
              classes and subjects, track school fees records, and review security settings.
            </p>
            <ul>
              <li><i className="fa fa-check-circle"></i> Manage Students & Teachers</li>
              <li><i className="fa fa-check-circle"></i> Configure timetables & classes</li>
              <li><i className="fa fa-check-circle"></i> Track fee status reports</li>
            </ul>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2>About A.A.N.M & V.V.R.S.R School</h2>
          <p>
            A.A.N.M & V.V.R.S.R Gudlavalleru School stands as a beacon of academic excellence.
            By incorporating modern full-stack web automation, we ensure that educational processes 
            remain transparent, records are securely vaulted, and parents, students, and educators 
            are unified in a frictionless database ecosystem.
          </p>
          <div className="about-highlights">
            <div className="highlight-item">
              <i className="fa fa-lock highlight-icon"></i>
              <div>
                <h4>Secure Records Vault</h4>
                <p>Protected by JSON Web Tokens and encrypted session identifiers.</p>
              </div>
            </div>
            <div className="highlight-item">
              <i className="fa fa-bolt highlight-icon"></i>
              <div>
                <h4>Instant Performance Metrics</h4>
                <p>Dynamic charts visualizing grades and attendance indicators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <SchoolLogo size={46} showText={true} theme="light" />
          <p className="footer-mission">Nurturing Minds, Automating Excellence.</p>
        </div>
        <div className="footer-bottom">
          <p>© 2026 A.A.N.M & V.V.R.S.R Gudlavalleru School Automation Portal. All rights reserved.</p>
          <p>Designed for professional administration & educational speed.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
