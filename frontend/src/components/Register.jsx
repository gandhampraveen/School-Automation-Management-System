import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SchoolLogo from './SchoolLogo';
import { api } from '../services/api';
import './Register.css';

const mockGoogleAccounts = {
  student: [
    { name: 'John Doe', email: 'john.doe@gmail.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { name: 'Alice Smith', email: 'alice.smith@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
  ],
  teacher: [
    { name: 'Dr. S. Rao', email: 's.rao@gmail.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { name: 'Prof. M. Kumar', email: 'm.kumar@gmail.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
  ]
};

const Register = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(''); // Roll number for student, Employee code for teacher
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('10-A');
  const [subject, setSubject] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!fullName || !username || !password || (role === 'teacher' && !subject)) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        role,
        full_name: fullName,
        username,
        password,
        ...(role === 'student' ? { class_name: className } : { subject })
      };

      await api.register(payload);
      setSuccess('Account registered successfully! Redirecting to login...');
      setFullName('');
      setUsername('');
      setPassword('');
      setSubject('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (account) => {
    setShowGoogleModal(false);
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const authResponse = await api.loginGoogle({
        email: account.email,
        name: account.name,
        avatar_url: account.avatar,
        role: role,
        class_name: className,
        subject: subject || 'General'
      });
      setSuccess('Gmail account linked and registered successfully! Signing you in...');
      const user = {
        ...authResponse.user,
        token: authResponse.token
      };
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'Gmail registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="register-box">
        {/* Logo and Crest Header */}
        <div className="register-logo-container">
          <SchoolLogo size={60} showText={true} theme="light" />
        </div>

        <div className="register-header-text">
          <h2>Create Account</h2>
          <p>Join the School Automation Platform</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="role-switch">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => {
              setRole('student');
              setError('');
            }}
          >
            <i className="fa fa-user-graduate"></i> Student
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
            onClick={() => {
              setRole('teacher');
              setError('');
            }}
          >
            <i className="fa fa-chalkboard-teacher"></i> Teacher
          </button>
        </div>

        {error && (
          <div className="error-msg show">
            <i className="fa fa-exclamation-circle"></i> {error}
          </div>
        )}

        {success && (
          <div className="success-msg show">
            <i className="fa fa-check-circle"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="register-input-group">
            <label htmlFor="fullName">
              <i className="fa fa-user"></i> Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Roll Number or Employee Code */}
          <div className="register-input-group">
            <label htmlFor="username">
              <i className={role === 'student' ? 'fa fa-id-card' : 'fa-user-tie'}></i>
              {role === 'student' ? ' Roll Number' : ' Employee Code'}
            </label>
            <input
              type="text"
              id="username"
              placeholder={role === 'student' ? "e.g., 1004" : "e.g., T003"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Conditional Inputs */}
          {role === 'student' ? (
            <div className="register-input-group">
              <label htmlFor="className">
                <i className="fa fa-university"></i> Class
              </label>
              <select
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="9-A">Class 9-A</option>
                <option value="9-B">Class 9-B</option>
              </select>
            </div>
          ) : (
            <div className="register-input-group">
              <label htmlFor="subject">
                <i className="fa fa-book"></i> Subject Expertise
              </label>
              <input
                type="text"
                id="subject"
                placeholder="e.g., Mathematics, Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required={role === 'teacher'}
              />
            </div>
          )}

          {/* Password */}
          <div className="register-input-group">
            <label htmlFor="password">
              <i className="fa fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn register-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Registering...
              </>
            ) : (
              <>
                <i className="fa fa-user-plus"></i> Sign Up
              </>
            )}
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
          Register with Gmail
        </button>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login" className="login-link">Login here</Link>
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
                <span style={{ fontWeight: 700, fontSize: '1rem', fontFamily: 'Montserrat, sans-serif' }}>Gmail Account Hub</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
              Choose a Gmail account to link to your <strong>{role.toUpperCase()}</strong> profile:
            </p>
            <div style={{ display: 'flex', flexFlow: 'column', gap: '10px' }}>
              {mockGoogleAccounts[role]?.map((account, idx) => (
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
              Linking Google registers your profile instantly in the database with your Unsplash photo.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;

