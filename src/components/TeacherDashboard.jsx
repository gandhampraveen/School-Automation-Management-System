import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './TeacherDashboard.css';

const TeacherDashboard = ({ user, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsResponse, attendanceResponse, marksResponse] = await Promise.all([
        api.getStudents(),
        api.getAttendance(),
        api.getMarks(),
      ]);

      const classStudents = (studentsResponse.students || []).filter((student) => student.class === selectedClass);
      setStudents(classStudents);
      setAttendanceData((attendanceResponse.attendance || []).filter((record) => classStudents.some((student) => student.rollNumber === record.rollNumber || student.rollNumber === record.studentRollNumber)));
      setMarksData((marksResponse.marks || []).filter((record) => classStudents.some((student) => student.rollNumber === record.rollNumber || student.rollNumber === record.studentRollNumber)));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (rollNumber, status, subject, date) => {
    const success = api.createAttendance({
      rollNumber,
      date: date || new Date().toISOString().split('T')[0],
      subject: subject || 'Mathematics',
      status,
      remarks: ''
    }).then(() => true).catch(() => false);

    Promise.resolve(success).then((result) => {
    if (result) {
      loadData();
      alert('Attendance marked successfully!');
    }
    });
  };

  const handleAddMarks = (rollNumber, subject, marks, total, grade) => {
    const success = api.createMark({
      rollNumber,
      subject,
      marks: parseInt(marks),
      total: parseInt(total),
      grade
    }).then(() => true).catch(() => false);

    Promise.resolve(success).then((result) => {
    if (result) {
      loadData();
      alert('Marks added successfully!');
    }
    });
  };

  const renderDashboard = () => (
    <div>
      <h2 className="page-title">Teacher Dashboard</h2>
      <p>Welcome, {user.name}!</p>
      <p>Subject: {user.subject}</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-value">{students.length}</p>
            <span className="stat-label">In {selectedClass}</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>Today's Attendance</h3>
            <p className="stat-value">
              {attendanceData.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'present').length}
            </p>
            <span className="stat-label">Present Today</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fa fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Class Average</h3>
            <p className="stat-value">
              {marksData.length > 0 ? Math.round(marksData.reduce((sum, m) => sum + m.marks, 0) / marksData.length) : 0}%
            </p>
            <span className="stat-label">Average Marks</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div>
      <h2 className="page-title">Manage Students</h2>
      <div className="class-selector">
        <label>Select Class: </label>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="form-control"
        >
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={loadData}>
          <i className="fa fa-refresh"></i> Refresh
        </button>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map(student => {
                  const stats = db.getAttendanceStats(student.rollNumber);
                  const marksStats = db.getMarksStats(student.rollNumber);
                  return (
                    <tr key={student.id}>
                      <td>{student.rollNumber}</td>
                      <td>{student.name}</td>
                      <td>
                        <span className={`status-badge ${stats.rate >= 75 ? 'status-present' : 'status-absent'}`}>
                          {stats.rate || 0}%
                        </span>
                      </td>
                      <td>{marksStats.average || 0}%</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowModal(true);
                          }}
                        >
                          <i className="fa fa-edit"></i> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No students found in this class
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div>
      <h2 className="page-title">Manage Attendance</h2>
      <div className="card">
        <div className="attendance-form">
          <h3>Mark Attendance for Today</h3>
          <div className="form-group">
            <label>Subject:</label>
            <input 
              type="text" 
              defaultValue={user.subject || 'Mathematics'}
              className="form-control"
              id="attendanceSubject"
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="form-control"
              id="attendanceDate"
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const subject = document.getElementById('attendanceSubject').value;
              const date = document.getElementById('attendanceDate').value;
              students.forEach(student => {
                const status = prompt(`Mark attendance for ${student.name} (${student.rollNumber}):\nEnter 'present' or 'absent'`);
                if (status && (status === 'present' || status === 'absent')) {
                  handleMarkAttendance(student.rollNumber, status, subject, date);
                }
              });
            }}
          >
            <i className="fa fa-check"></i> Mark All Students
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3>Today's Attendance</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData
                .filter(a => a.date === new Date().toISOString().split('T')[0])
                .map(record => {
                  const student = students.find(s => s.rollNumber === record.rollNumber);
                  return (
                    <tr key={record.id}>
                      <td>{record.rollNumber}</td>
                      <td>{student?.name || 'Unknown'}</td>
                      <td>{record.subject}</td>
                      <td>
                        <span className={`status-badge status-${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              {attendanceData.filter(a => a.date === new Date().toISOString().split('T')[0]).length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No attendance marked for today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMarks = () => (
    <div>
      <h2 className="page-title">Manage Marks</h2>
      <div className="card">
        <h3>Add/Edit Marks</h3>
        <div className="marks-form">
          <div className="form-row">
            <div className="form-group">
              <label>Student:</label>
              <select className="form-control" id="marksStudent">
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.rollNumber}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Subject:</label>
              <input 
                type="text" 
                defaultValue={user.subject || 'Mathematics'}
                className="form-control"
                id="marksSubject"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Marks:</label>
              <input 
                type="number" 
                className="form-control"
                id="marksObtained"
                placeholder="Enter marks"
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Total:</label>
              <input 
                type="number" 
                className="form-control"
                id="marksTotal"
                placeholder="Enter total"
                defaultValue="100"
              />
            </div>
            <div className="form-group">
              <label>Grade:</label>
              <select className="form-control" id="marksGrade">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const rollNumber = document.getElementById('marksStudent').value;
              const subject = document.getElementById('marksSubject').value;
              const marks = document.getElementById('marksObtained').value;
              const total = document.getElementById('marksTotal').value;
              const grade = document.getElementById('marksGrade').value;
              
              if (!rollNumber || !subject || !marks || !total) {
                alert('Please fill all fields');
                return;
              }
              
              handleAddMarks(rollNumber, subject, marks, total, grade);
            }}
          >
            <i className="fa fa-save"></i> Save Marks
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3>All Marks</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map(record => {
                const student = students.find(s => s.rollNumber === record.rollNumber);
                return (
                  <tr key={record.id}>
                    <td>{record.rollNumber}</td>
                    <td>{student?.name || 'Unknown'}</td>
                    <td>{record.subject}</td>
                    <td>{record.marks}</td>
                    <td>{record.total}</td>
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
                );
              })}
              {marksData.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No marks records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fa fa-graduation-cap"></i>
          <span>Teacher Portal</span>
        </div>
        <div className="nav-user">
          <span>{user.name}</span>
          <span className="nav-role">({user.subject})</span>
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
              className={`sidebar-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <i className="fa fa-users"></i> Students
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <i className="fa fa-calendar-check"></i> Attendance
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'marks' ? 'active' : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              <i className="fa fa-chart-line"></i> Marks
            </button>
          </div>
        </div>

        <div className="main-content">
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'students' && renderStudents()}
              {activeTab === 'attendance' && renderAttendance()}
              {activeTab === 'marks' && renderMarks()}
            </>
          )}
        </div>
      </div>

      {/* Modal for student management */}
      {showModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Student: {selectedStudent.name}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="student-details">
                <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
                <p><strong>Class:</strong> {selectedStudent.class}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
              </div>
              <div className="student-actions">
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    const subject = prompt('Enter subject:');
                    if (subject) {
                      handleMarkAttendance(
                        selectedStudent.rollNumber, 
                        'present', 
                        subject, 
                        new Date().toISOString().split('T')[0]
                      );
                    }
                  }}
                >
                  <i className="fa fa-check-circle"></i> Mark Present
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    const subject = prompt('Enter subject:');
                    if (subject) {
                      handleMarkAttendance(
                        selectedStudent.rollNumber, 
                        'absent', 
                        subject, 
                        new Date().toISOString().split('T')[0]
                      );
                    }
                  }}
                >
                  <i className="fa fa-times-circle"></i> Mark Absent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;