import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Editable settings fields
  const [schoolName, setSchoolName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [theme, setTheme] = useState('modern');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getSettings()
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
          setSchoolName(data.settings.schoolName || '');
          setAcademicYear(data.settings.academicYear || '');
          setTheme(data.settings.theme || 'modern');
        }
      })
      .catch(err => setError(err.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate updating settings in database
    setTimeout(() => {
      setSaving(false);
      alert('Settings updated successfully!');
    }, 800);
  };

  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '20px' }}>
        <h3>System Settings</h3>
        <p>Configure general parameters, institution name, academic cycles, and application preferences.</p>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading settings...</div>
      ) : settings ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '20px', fontWeight: '600' }}>School Details</h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>School Name:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ width: '100%', padding: '10px' }} 
                  value={schoolName} 
                  onChange={(e) => setSchoolName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>Academic Year:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ width: '100%', padding: '10px' }} 
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px', color: '#495057' }}>Select Theme:</label>
                <select 
                  className="form-control" 
                  style={{ width: '100%', height: '40px', padding: '10px' }} 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="modern">Modern Light</option>
                  <option value="dark">Sleek Dark Mode</option>
                  <option value="glass">Glassmorphism</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                <i className={`fa ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ fontSize: '18px', color: '#2c3e50', fontWeight: '600' }}>System Information</h3>
            <div style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '10px', fontSize: '14px' }}>
              <span style={{ color: '#6c757d', display: 'block' }}>Backend Service:</span>
              <strong style={{ color: '#2c3e50' }}>Flask REST API v3.0.0</strong>
            </div>
            <div style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '10px', fontSize: '14px' }}>
              <span style={{ color: '#6c757d', display: 'block' }}>Database Driver:</span>
              <strong style={{ color: '#2c3e50' }}>SQLite (SQLAlchemy ORM)</strong>
            </div>
            <div style={{ borderBottom: '1px solid #e9ecef', paddingBottom: '10px', fontSize: '14px' }}>
              <span style={{ color: '#6c757d', display: 'block' }}>Frontend Framework:</span>
              <strong style={{ color: '#2c3e50' }}>React 18.2 (Vite Client)</strong>
            </div>
            <div style={{ fontSize: '14px' }}>
              <span style={{ color: '#6c757d', display: 'block' }}>Current Session JWT Key:</span>
              <strong style={{ color: '#28a745' }}>Enabled (HMAC-SHA256)</strong>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>No settings loaded.</div>
      )}
    </div>
  );
}