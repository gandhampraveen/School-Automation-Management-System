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

  // Fees State
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);

  // Feedback State
  const [feedbackCategory, setFeedbackCategory] = useState('Academics');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attendanceResponse, marksResponse, assignmentsResponse, timetableResponse, feesResponse] = await Promise.all([
        api.getAttendance(),
        api.getMarks(),
        api.getAssignments(),
        api.getTimetable(),
        api.getFees().catch(() => ({ fees: [] }))
      ]);

      const attendanceData = (attendanceResponse.attendance || []).filter((record) => record.rollNumber === user.rollNumber || record.studentRollNumber === user.rollNumber);
      const marksData = (marksResponse.marks || []).filter((record) => record.rollNumber === user.rollNumber || record.studentRollNumber === user.rollNumber);
      const assignmentsData = assignmentsResponse.assignments || [];
      const timetableData = timetableResponse.timetable || [];
      const feesData = feesResponse.fees || [];

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
      setFees(feesData);
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

  const handlePayClick = (fee) => {
    setSelectedFee(fee);
    setPaymentSuccess(false);
    setVerifyingPayment(false);
    setQrImageError(false);
    setShowQRModal(true);
  };

  const handleSimulatePayment = async () => {
    if (!selectedFee) return;
    setVerifyingPayment(true);
    try {
      await api.payFee(selectedFee.id);
      setTimeout(() => {
        setVerifyingPayment(false);
        setPaymentSuccess(true);
        // Refresh fee lists
        loadData();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Payment simulation failed');
      setVerifyingPayment(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');
    if (!feedbackMessage.trim()) {
      setFeedbackError('Feedback message cannot be empty');
      return;
    }

    setSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        category: feedbackCategory,
        rating: feedbackRating,
        message: feedbackMessage
      });
      setFeedbackSuccess('Feedback submitted successfully. Thank you for your review!');
      setFeedbackMessage('');
      setFeedbackRating(5);
    } catch (err) {
      setFeedbackError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
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
      <div className="welcome-section" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <div className="welcome-content">
          <h2 className="page-title" style={{ color: '#64748b' }}>Dashboard</h2>
          <h1 className="welcome-title" style={{ color: '#0f172a' }}>Welcome back, {user.name}!</h1>
          <p className="welcome-subtitle" style={{ color: '#475569' }}>
            Stay updated with your academic progress and school activities
          </p>
        </div>
        <div className="welcome-avatar">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)' }} 
            />
          ) : (
            <div className="avatar-circle" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <i className="fa fa-user-graduate"></i>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="fa fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3 style={{ color: '#64748b' }}>Attendance</h3>
            <p className="stat-value" style={{ color: '#0f172a' }}>{attendanceStats.rate || 0}%</p>
            <span className="stat-label">Present: {attendanceStats.present || 0} / {attendanceStats.total || 0}</span>
          </div>
        </div>
        
        <div className="stat-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="fa fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3 style={{ color: '#64748b' }}>Average Marks</h3>
            <p className="stat-value" style={{ color: '#0f172a' }}>{marksStats.average || 0}%</p>
            <span className="stat-label">{marksStats.totalSubjects || 0} Subjects</span>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div className="stat-icon" style={{ background: '#fef9c3', color: '#ca8a04' }}>
            <i className="fa fa-wallet"></i>
          </div>
          <div className="stat-info">
            <h3 style={{ color: '#64748b' }}>Pending Fees</h3>
            <p className="stat-value" style={{ color: '#0f172a' }}>
              ${fees.reduce((acc, curr) => curr.status !== 'paid' ? acc + (curr.amountDue - curr.amountPaid) : acc, 0).toLocaleString()}
            </p>
            <span className="stat-label">{fees.filter(f => f.status !== 'paid').length} Due Invoices</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="charts-grid">
        <div className="chart-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a' }}>Attendance Ratio</h3>
          <div className="chart-container">
            {attendance.length > 0 ? (
              <div style={{ width: '180px', margin: '0 auto' }}>
                <Doughnut data={doughnutData} />
              </div>
            ) : (
              <p className="no-data-message">No attendance history available</p>
            )}
          </div>
        </div>

        <div className="chart-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a' }}>Academic Marks</h3>
          <div className="chart-container">
            {marks.length > 0 ? (
              <Bar data={marksChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="no-data-message">No marks transcripts loaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="recent-activity">
        <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#0f172a' }}>Recent Academic Logs</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ color: '#0f172a' }}>Date</th>
                  <th style={{ color: '#0f172a' }}>Event Type</th>
                  <th style={{ color: '#0f172a' }}>Subject</th>
                  <th style={{ color: '#0f172a' }}>Status / Grade</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((act, idx) => (
                    <tr key={idx}>
                      <td>{act.date}</td>
                      <td>{act.activity}</td>
                      <td>{act.subject}</td>
                      <td>
                        <span className={`status-badge ${act.status === 'Present' || act.status === 'Submitted' ? 'status-present' : 'status-absent'}`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No activities logged recently</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)' }} 
            />
          ) : (
            <i className="fa fa-user-circle" style={{ fontSize: '100px', color: '#2563eb' }}></i>
          )}
        </div>
        <div className="profile-info">
          <h2 style={{ color: '#0f172a' }}>{user.name}</h2>
          <p><strong>Roll Number:</strong> {user.rollNumber}</p>
          <p><strong>Email Username:</strong> {user.username}@school.edu</p>
          <p><strong>Database System ID:</strong> {user.id}</p>
          <p><strong>System Role:</strong> {user.role.toUpperCase()}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#64748b' }}>Attendance Rate</h4>
          <p className="stat-number" style={{ color: '#0f172a' }}>{attendanceStats.rate || 0}%</p>
        </div>
        <div className="stat-item" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#64748b' }}>Average Marks</h4>
          <p className="stat-number" style={{ color: '#0f172a' }}>{marksStats.average || 0}%</p>
        </div>
        <div className="stat-item" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#64748b' }}>Subjects</h4>
          <p className="stat-number" style={{ color: '#0f172a' }}>{marksStats.totalSubjects || 0}</p>
        </div>
        <div className="stat-item" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ color: '#64748b' }}>Assignments</h4>
          <p className="stat-number" style={{ color: '#0f172a' }}>{assignments.filter(a => a.status === 'pending').length}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container" style={{ background: '#f8fafc' }}>
        <nav className="dashboard-nav" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
          <div className="nav-brand">
            <i className="fa fa-graduation-cap" style={{ color: '#2563eb' }}></i>
            <span style={{ color: '#0f172a' }}>A.A.N.M & V.V.R.S.R</span>
          </div>
          <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{user?.name || 'Loading...'}</span>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loader" style={{ borderTopColor: '#2563eb' }}></div>
          <p>Loading your student portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ background: '#f8fafc' }}>
      <nav className="dashboard-nav" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="nav-brand">
          <i className="fa fa-graduation-cap" style={{ color: '#2563eb', fontSize: '1.8rem' }}></i>
          <span style={{ color: '#0f172a', fontWeight: '800', fontFamily: 'Montserrat, sans-serif' }}>A.A.N.M & V.V.R.S.R</span>
        </div>
        <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.avatarUrl && (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} 
            />
          )}
          <span style={{ color: '#334155', fontWeight: 600 }}>{user.name}</span>
          <span className="nav-roll" style={{ background: '#eff6ff', color: '#1e40af' }}>({user.rollNumber})</span>
          <button onClick={onLogout} className="btn logout-topbar-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            <i className="fa fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="sidebar" style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0', boxShadow: 'none' }}>
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
              className={`sidebar-item ${activeTab === 'fees' ? 'active' : ''}`}
              onClick={() => setActiveTab('fees')}
            >
              <i className="fa fa-wallet"></i> Fees & Payments
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'feedback' ? 'active' : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <i className="fa fa-comments"></i> Submit Feedback
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
              <h2 className="page-title" style={{ color: '#0f172a' }}>Attendance Records</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
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
              <h2 className="page-title" style={{ color: '#0f172a' }}>Assignments</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
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
              <h2 className="page-title" style={{ color: '#0f172a' }}>Marks & Grades</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
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
                                          record.grade === 'C' ? '#cce5ff' : '#f8d7da',
                                color: record.grade === 'A' ? '#155724' : 
                                       record.grade === 'B' ? '#856404' : 
                                       record.grade === 'C' ? '#004085' : '#721c24'
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

          {/* Fees & QR Scanner payment module */}
          {activeTab === 'fees' && (
            <div className="tab-content">
              <h2 className="page-title" style={{ color: '#0f172a' }}>School Fee Invoices</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Choose an invoice to pay instantly using our mock Google Pay / PhonePe UPI QR code scanner.
                </p>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Roll Number</th>
                        <th>Amount Due</th>
                        <th>Amount Paid</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.length > 0 ? (
                        fees.map(f => (
                          <tr key={f.id}>
                            <td>INV-00{f.id}</td>
                            <td>{f.studentRollNumber}</td>
                            <td>${f.amountDue.toLocaleString()}</td>
                            <td>${f.amountPaid.toLocaleString()}</td>
                            <td>
                              <span className={`status-badge`} style={{
                                background: f.status === 'paid' ? '#d4edda' : '#f8d7da',
                                color: f.status === 'paid' ? '#155724' : '#721c24'
                              }}>
                                {f.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              {f.status !== 'paid' ? (
                                <button 
                                  className="btn btn-primary"
                                  onClick={() => handlePayClick(f)}
                                  style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                >
                                  <i className="fa fa-qrcode"></i> Pay Now
                                </button>
                              ) : (
                                <span style={{ color: '#22c55e', fontWeight: 600 }}>
                                  <i className="fa fa-check-circle"></i> Paid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>No fee record found in database</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Feedback portal tab */}
          {activeTab === 'feedback' && (
            <div className="tab-content">
              <h2 className="page-title" style={{ color: '#0f172a' }}>Submit School Review / Feedback</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Your feedback helps us maintain A.A.N.M & V.V.R.S.R school standards.
                </p>

                {feedbackError && (
                  <div className="error-msg show" style={{ display: 'flex', marginBottom: '20px' }}>
                    <i className="fa fa-exclamation-circle"></i> {feedbackError}
                  </div>
                )}

                {feedbackSuccess && (
                  <div className="success-msg show" style={{ display: 'flex', marginBottom: '20px' }}>
                    <i className="fa fa-check-circle"></i> {feedbackSuccess}
                  </div>
                )}

                <form onSubmit={handleFeedbackSubmit}>
                  <div className="register-input-group" style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: 600 }}>Feedback Category</label>
                    <select 
                      className="form-control" 
                      value={feedbackCategory} 
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      style={{ height: '42px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Academics">Academics & Curriculums</option>
                      <option value="Facilities">School Facilities & Labs</option>
                      <option value="Teachers">Instructors & Staff</option>
                      <option value="General">General Administration</option>
                    </select>
                  </div>

                  <div className="register-input-group" style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: 600 }}>Rating</label>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '24px', cursor: 'pointer', color: '#fbbf24' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star} 
                          className={star <= feedbackRating ? "fa fa-star" : "far fa-star"}
                          onClick={() => setFeedbackRating(star)}
                        ></i>
                      ))}
                    </div>
                  </div>

                  <div className="register-input-group" style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: 600 }}>Detailed Review</label>
                    <textarea 
                      rows="4" 
                      placeholder="Tell us what you think..." 
                      className="form-control"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      style={{ border: '1px solid #cbd5e1', padding: '12px', resize: 'vertical' }}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingFeedback}
                    style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center' }}
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2 className="page-title" style={{ color: '#0f172a' }}>My Profile</h2>
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                {renderProfile()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Scanner simulation Modal */}
      {showQRModal && selectedFee && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff', width: '90%', maxWidth: '400px',
            borderRadius: '16px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0', color: '#1e293b', textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>UPI QR Pay Gateway</span>
              <button 
                onClick={() => setShowQRModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            {!paymentSuccess ? (
              <>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                  Scan the UPI QR code using Google Pay, PhonePe, or Paytm to pay <strong>${selectedFee.amountDue.toLocaleString()}</strong>.
                </p>

                {/* PhonePe QR Code Scanner */}
                <div style={{
                  background: '#ffffff', padding: '10px', borderRadius: '12px',
                  display: 'inline-block', border: '1px solid #e2e8f0', marginBottom: '20px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  {!qrImageError ? (
                    <img 
                      src="/phonepe_scanner.jpg" 
                      alt="PhonePe UPI QR Code" 
                      onError={() => setQrImageError(true)}
                      style={{ width: '190px', height: 'auto', borderRadius: '8px', display: 'block', margin: '0 auto' }} 
                    />
                  ) : (
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      width: '190px', height: '190px', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1'
                    }}>
                      <i className="fa fa-qrcode" style={{ fontSize: '64px', color: '#6366f1', marginBottom: '10px' }}></i>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>UPI QR Scanner</span>
                    </div>
                  )}
                </div>

                <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#5b21b6', marginBottom: '20px', fontWeight: 600 }}>
                  <div style={{ marginBottom: '3px' }}>Merchant Account: Gandham Praveen</div>
                  <div>UPI: praveen.gandham@ybl</div>
                </div>

                <button 
                  onClick={handleSimulatePayment}
                  disabled={verifyingPayment}
                  style={{
                    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none', borderRadius: '10px', color: '#ffffff', fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  {verifyingPayment ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i> Verifying scan...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-mobile-alt"></i> Simulate UPI Scan Success
                    </>
                  )}
                </button>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <i className="fa fa-check-circle" style={{ fontSize: '70px', color: '#22c55e', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '10px' }}>Payment Verified!</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '25px' }}>
                  Invoice <strong>INV-00{selectedFee.id}</strong> has been marked as <strong>PAID</strong> in the database.
                </p>
                <button 
                  className="btn btn-success"
                  onClick={() => setShowQRModal(false)}
                  style={{ width: '100%', padding: '12px' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;