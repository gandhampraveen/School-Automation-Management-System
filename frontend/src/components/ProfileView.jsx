import React from 'react';
import { db } from '../utils/SchoolDB';

const ProfileView = ({ user }) => {
  const [attendanceStats, setAttendanceStats] = React.useState({});
  const [marksStats, setMarksStats] = React.useState({});

  React.useEffect(() => {
    if (user) {
      const stats = db.getAttendanceStats(user.rollNumber);
      const marks = db.getMarksStats(user.rollNumber);
      setAttendanceStats(stats);
      setMarksStats(marks);
    }
  }, [user]);

  return (
    <div className="profile-view">
      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fa fa-user-circle" style={{ fontSize: '80px', color: '#4a6bbb' }}></i>
          </div>
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p><strong>Roll Number:</strong> {user.rollNumber}</p>
            <p><strong>Class:</strong> {user.class}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Type:</strong> {user.type}</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>Attendance Rate</h3>
            <p className="stat-value">{attendanceStats.rate || 0}%</p>
            <span className="stat-label">
              Present: {attendanceStats.present || 0} / {attendanceStats.total || 0}
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Average Marks</h3>
            <p className="stat-value">{marksStats.average || 0}%</p>
            <span className="stat-label">{marksStats.totalSubjects || 0} Subjects</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => window.print()}>
            <i className="fa fa-print"></i> Print Profile
          </button>
          <button className="btn btn-success" onClick={() => {
            const data = {
              user,
              attendanceStats,
              marksStats
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${user.name}-profile.json`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}>
            <i className="fa fa-download"></i> Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;