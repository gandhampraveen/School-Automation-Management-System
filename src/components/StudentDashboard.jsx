import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './StudentDashboard.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentDashboard = ({ user, onLogout }) => {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [marksStats, setMarksStats] = useState({});
  const [timetable, setTimetable] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attendanceResponse, marksResponse, assignmentsResponse, timetableResponse] = await Promise.all([
        api.getAttendance(),
        api.getMarks(),
        api.getAssignments(),
        api.getTimetable(),
      ]);

      const attendanceData = (attendanceResponse.attendance || []).filter((record) => record.rollNumber === user.rollNumber || record.studentRollNumber === user.rollNumber);
      const marksData = (marksResponse.marks || []).filter((record) => record.rollNumber === user.rollNumber || record.studentRollNumber === user.rollNumber);
      const assignmentsData = assignmentsResponse.assignments || [];
      const timetableData = timetableResponse.timetable || [];

      const attendanceTotals = attendanceData.reduce(
        (accumulator, record) => {
          accumulator.total += 1;
          if (record.status === 'present') accumulator.present += 1;
          if (record.status === 'absent') accumulator.absent += 1;
          return accumulator;
        },
        { total: 0, present: 0, absent: 0 }
      );

      const averageMarks = marksData.length
        ? Math.round(marksData.reduce((sum, record) => sum + Number(record.marks || 0), 0) / marksData.length)
        : 0;

      setAttendance(attendanceData);
      setMarks(marksData);
      setAssignments(assignmentsData);
      setAttendanceStats({
        ...attendanceTotals,
        rate: attendanceTotals.total ? Math.round((attendanceTotals.present / attendanceTotals.total) * 100) : 0,
      });
      setMarksStats({ average: averageMarks, totalSubjects: marksData.length });
      setTimetable(timetableData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recent Activity Data
  const getRecentActivity = () => {
    const activities = [];

    // Add assignments
    assignments.forEach(assignment => {
      if (assignment.status === 'submitted') {
        activities.push({
          date: assignment.dueDate,
          activity: assignment.title,
          subject: assignment.subject,
          status: 'Submitted',
          type: 'assignment'
        });
      }
    });

    // Add attendance
    attendance.slice(0, 5).forEach(record => {
      activities.push({
        date: record.date,
        activity: 'Class Attendance',
        subject: record.subject,
        status: record.status === 'present' ? 'Present' : 'Absent',
        type: 'attendance'
      });
    });

    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  const attendanceChartData = {
    labels: attendance.map(a => a.date),
    datasets: [
      {
        label: 'Attendance',
        data: attendance.map(a => a.status === 'present' ? 1 : 0),
        backgroundColor: attendance.map(a => 
          a.status === 'present' ? 'rgba(40, 167, 69, 0.6)' : 'rgba(220, 53, 69, 0.6)'
        ),
        borderColor: attendance.map(a => 
          a.status === 'present' ? '#28a745' : '#dc3545'
        ),
        borderWidth: 2,
      },
    ],
  };

  const marksChartData = {
    labels: marks.map(m => m.subject),
    datasets: [
      {
        label: 'Marks',
        data: marks.map(m => m.marks),
        backgroundColor: 'rgba(74, 107, 187, 0.6)',
        borderColor: '#4a6bbb',
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceStats.present || 0, attendanceStats.absent || 0],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 0,
      },
    ],
  };

  const renderDashboard = () => (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="page-title">Dashboard</h2>
          <h1 className="welcome-title">Welcome back, {user.name}!</h1>
          <p className="welcome-subtitle">
            Stay updated with your academic progress and school activities
          </p>
        </div>
        <div className="welcome-avatar">
          <div className="avatar-circle">
            <i className="fa fa-user-graduate"></i>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>Attendance</h3>
            <p className="stat-value">{attendanceStats.rate || 0}%</p>
            <span className="stat-label">Present: {attendanceStats.present || 0} / {attendanceStats.total || 0}</span>
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
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-tasks"></i>
          </div>
          <div className="stat-info">
            <h3>Assignments</h3>
            <p className="stat-value">{assignments.filter(a => a.status === 'pending').length}</p>
            <span className="stat-label">Pending Assignments</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Attendance Overview</h3>
          <div className="chart-container">
            {attendanceStats.total > 0 ? (
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: true }} />
            ) : (
              <p className="no-data-message">No attendance data available</p>
            )}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Marks Overview</h3>
          <div className="chart-container">
            {marks.length > 0 ? (
              <Bar data={marksChartData} options={{ maintainAspectRatio: true }} />
            ) : (
              <p className="no-data-message">No marks data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="card">
          <h3>Recent Activity</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.date}</td>
                      <td>{activity.activity}</td>
                      <td>{activity.subject}</td>
                      <td>
                        <span className={`status-badge status-${activity.status.toLowerCase()}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No recent activity
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="school-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fa fa-graduation-cap"></i>
            <span>A.A.N.M & V.V.R.S.R</span>
          </div>
          <p>GUDLAVALLERU SCHOOL</p>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fa fa-user-circle" style={{ fontSize: '100px', color: '#4a6bbb' }}></i>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p><strong>Roll Number:</strong> {user.rollNumber}</p>
          <p><strong>Class:</strong> {user.class}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Type:</strong> {user.type}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <h4>Attendance Rate</h4>
          <p className="stat-number">{attendanceStats.rate || 0}%</p>
        </div>
        <div className="stat-item">
          <h4>Average Marks</h4>
          <p className="stat-number">{marksStats.average || 0}%</p>
        </div>
        <div className="stat-item">
          <h4>Subjects</h4>
          <p className="stat-number">{marksStats.totalSubjects || 0}</p>
        </div>
        <div className="stat-item">
          <h4>Assignments</h4>
          <p className="stat-number">{assignments.filter(a => a.status === 'pending').length}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <i className="fa fa-graduation-cap"></i>
            <span>School System</span>
          </div>
          <div className="nav-user">
            <span>{user?.name || 'Loading...'}</span>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fa fa-graduation-cap"></i>
          <span>A.A.N.M & V.V.R.S.R</span>
        </div>
        <div className="nav-user">
          <span>{user.name}</span>
          <span className="nav-roll">({user.rollNumber})</span>
          <button onClick={onLogout} className="btn btn-danger btn-sm">
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fa fa-home"></i> Dashboard
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <i className="fa fa-calendar-check"></i> Attendance
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <i className="fa fa-tasks"></i> Assignments
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'marks' ? 'active' : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              <i className="fa fa-chart-line"></i> Marks & Grades
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fa fa-user"></i> My Profile
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'attendance' && (
            <div className="tab-content">
              <h2 className="page-title">Attendance Records</h2>
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.length > 0 ? (
                        attendance.map(record => (
                          <tr key={record.id}>
                            <td>{record.date}</td>
                            <td>{record.subject}</td>
                            <td>
                              <span className={`status-badge status-${record.status}`}>
                                {record.status}
                              </span>
                            </td>
                            <td>{record.remarks || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>
                            No attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'assignments' && (
            <div className="tab-content">
              <h2 className="page-title">Assignments</h2>
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.length > 0 ? (
                        assignments.map(assignment => (
                          <tr key={assignment.id}>
                            <td>{assignment.title}</td>
                            <td>{assignment.subject}</td>
                            <td>{assignment.dueDate}</td>
                            <td>
                              <span className={`status-badge status-${assignment.status}`}>
                                {assignment.status}
                              </span>
                            </td>
                            <td>{assignment.grade}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center' }}>
                            No assignments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'marks' && (
            <div className="tab-content">
              <h2 className="page-title">Marks & Grades</h2>
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Total</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.length > 0 ? (
                        marks.map(record => (
                          <tr key={record.id}>
                            <td>{record.subject}</td>
                            <td>{record.marks}</td>
                            <td>{record.total}</td>
                            <td>{Math.round((record.marks / record.total) * 100)}%</td>
                            <td>
                              <span className="status-badge" style={{
                                background: record.grade === 'A' ? '#d4edda' : 
                                          record.grade === 'B' ? '#fff3cd' : 
                                          record.grade === 'C' ? '#cce5ff' : '#f8d7da'
                              }}>
                                {record.grade}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center' }}>
                            No marks records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2 className="page-title">My Profile</h2>
              <div className="card">
                {renderProfile()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;