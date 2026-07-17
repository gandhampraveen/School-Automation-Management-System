import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SchoolLogo from './SchoolLogo';
import { api } from '../services/api';
import './Login.css';

const mockGoogleAccounts = {
  student: [
    { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { name: 'Aarav Patel', email: 'aarav.patel@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
  ],
  teacher: [
    { name: 'Dr. S. Rao', email: 's.rao@gmail.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { name: 'Prof. M. Kumar', email: 'm.kumar@gmail.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
  ],
  admin: [
    { name: 'School Admin', email: 'admin.school@gmail.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' }
  ]
};

const Login = ({ onLogin, onLoginSuccess }) => {
  const [userType, setUserType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter all fields');
      return;
    }

    onLogin(identifier, password, userType, setError);
  };

  const handleGoogleSelect = async (account) => {
    setShowGoogleModal(false);
    setError('');
    try {
      const authResponse = await api.loginGoogle({
        email: account.email,
        name: account.name,
        avatar_url: account.avatar,
        role: userType
      });
      const user = {
        ...authResponse.user,
        token: authResponse.token
      };
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="login-box">
        {/* School Logo */}
        <div className="school-logo-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <SchoolLogo size={60} showText={true} theme="light" />
        </div>
        
        {/* User Type Selector */}
        <div className="user-type-selector">
          <div 
            className={`user-type ${userType === 'student' ? 'active' : ''}`}
            onClick={() => setUserType('student')}
          >
            <i className="fa fa-user-graduate"></i>
            Student
          </div>
          <div 
            className={`user-type ${userType === 'teacher' ? 'active' : ''}`}
            onClick={() => setUserType('teacher')}
          >
            <i className="fa fa-chalkboard-teacher"></i>
            Teacher
          </div>
          <div 
            className={`user-type ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            <i className="fa fa-user-shield"></i>
            Admin
          </div>
        </div>
        
        {/* Error Message */}
        <div className={`error-message ${error ? 'show' : ''}`}>
          <i className="fa fa-exclamation-circle"></i>
          {error}
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="identifier">
              <i className={`fa ${userType === 'student' ? 'fa-id-card' : userType === 'teacher' ? 'fa-user-tie' : 'fa-user-shield'}`}></i>
              {userType === 'student' ? 'Roll Number' : userType === 'teacher' ? 'Teacher ID' : 'Admin Username'}
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={`Enter your ${userType === 'student' ? 'roll number' : userType === 'teacher' ? 'teacher ID' : 'admin username'}`}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">
              <i className="fa fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn login-btn">
            <i className="fa fa-sign-in"></i>
            Login
          </button>
        </form>

        {/* Google Authentication Button */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#64748b' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #cbd5e1' }} />
          <span style={{ padding: '0 10px', fontSize: '0.8rem', fontWeight: 700 }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #cbd5e1' }} />
        </div>

        <button 
          type="button" 
          onClick={() => setShowGoogleModal(true)}
          style={{
            width: '100%',
            padding: '12px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#334155',
            fontWeight: '600',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          className="google-signin-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign in with Gmail
        </button>
        
        {/* Demo Credentials */}
        <div className="demo-credentials" style={{ marginTop: '20px' }}>
          <h3>
            <i className="fa fa-info-circle"></i>
            Demo Credentials:
          </h3>
          {userType === 'student' ? (
            <ul>
              <li><strong>Roll Number:</strong> 1001 <strong>Password:</strong> password</li>
            </ul>
          ) : userType === 'teacher' ? (
            <ul>
              <li><strong>Teacher ID:</strong> T001 <strong>Password:</strong> password</li>
            </ul>
          ) : (
            <ul>
              <li><strong>Username:</strong> admin <strong>Password:</strong> admin123</li>
            </ul>
          )}
        </div>
        
        <div className="login-footer">
          <p style={{ marginBottom: '12px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Register profile</Link>
          </p>
          <p>
            <i className="fa fa-life-ring"></i>
            Contact admin if you forgot your password
          </p>
        </div>
      </div>

      {/* Simulated Google Sign-In Popup */}
      {showGoogleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff', width: '90%', maxWidth: '380px',
            borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0', color: '#1e293b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Choose a Google account to log in as a <strong>{userType.toUpperCase()}</strong>:
            </p>
            <div style={{ display: 'flex', flexFlow: 'column', gap: '10px' }}>
              {mockGoogleAccounts[userType]?.map((account, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleGoogleSelect(account)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                    borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer',
                    transition: 'all 0.2s ease', background: '#f8fafc'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#eff6ff'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                >
                  <img 
                    src={account.avatar} 
                    alt={account.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>{account.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{account.email}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              By continuing, Google will share your name, email address, and profile picture with this school.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;