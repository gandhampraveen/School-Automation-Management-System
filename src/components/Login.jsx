import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter all fields');
      return;
    }

    onLogin(identifier, password, userType, setError);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
      
      <div className="login-box">
        {/* School Logo with Animation */}
        <div className="school-logo-container">
          <div className="school-logo">
            <div className="logo-circle">
              <div className="logo-inner">
                <i className="fa fa-graduation-cap logo-icon"></i>
                <div className="logo-ring"></div>
              </div>
            </div>
            <div className="logo-shine"></div>
          </div>
          <div className="logo-text">
            <h1>A.A.N.M & V.V.R.S.R</h1>
            <p>GUDLAVALLERU SCHOOL</p>
          </div>
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
              <i className={`fa ${userType === 'student' ? 'fa-id-card' : 'fa-user-tie'}`}></i>
              {userType === 'student' ? 'Roll Number' : 'Teacher ID'}
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={`Enter your ${userType === 'student' ? 'roll number' : 'teacher ID'}`}
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
        
        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h3>
            <i className="fa fa-info-circle"></i>
            Demo Credentials:
          </h3>
          {userType === 'student' ? (
            <ul>
              <li><strong>Roll Number:</strong> 1001 <strong>Password:</strong> password</li>
              <li><strong>Roll Number:</strong> 1002 <strong>Password:</strong> password</li>
              <li><strong>Roll Number:</strong> 1003 <strong>Password:</strong> password</li>
            </ul>
          ) : (
            <ul>
              <li><strong>Teacher ID:</strong> T001 <strong>Password:</strong> password</li>
              <li><strong>Teacher ID:</strong> T002 <strong>Password:</strong> password</li>
            </ul>
          )}
        </div>
        
        <div className="login-footer">
          <p>
            <i className="fa fa-life-ring"></i>
            Contact admin if you forgot your password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;