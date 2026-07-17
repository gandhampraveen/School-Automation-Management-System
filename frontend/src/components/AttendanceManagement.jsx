import React, { useState, useEffect } from 'react';
import { db } from '../utils/SchoolDB';

const AttendanceManagement = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Mathematics');
  const [loading, setLoading] = useState(false);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  const loadData = () => {
    setLoading(true);
    try {
      const classStudents = db.getStudentsByClass(selectedClass);
      setStudents(classStudents);
      
      const allAttendance = db.getAllAttendance();
      const filteredAttendance = allAttendance.filter(a => 
        classStudents.some(s => s.rollNumber === a.rollNumber) &&
        a.date === date
      );
      setAttendance(filteredAttendance);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = (rollNumber, status) => {
    const success = db.markAttendance({
      rollNumber,
      date,
      subject,
      status,
      remarks: ''
    });
    
    if (success) {
      loadData();
    }
  };

  const handleMarkAll = (status) => {
    students.forEach(student => {
      handleMarkAttendance(student.rollNumber, status);
    });
  };

  const getStudentStatus = (rollNumber) => {
    const record = attendance.find(a => a.rollNumber === rollNumber);
    return record ? record.status : 'not-marked';
  };

  return (
    <div className="attendance-management">
      <div className="card">
        <h3>Attendance Management</h3>
        
        <div className="filters">
          <div className="form-group">
            <label>Class:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-control"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="form-control"
              placeholder="Enter subject"
            />
          </div>
          
          <button className="btn btn-primary" onClick={loadData}>
            <i className="fa fa-refresh"></i> Load
          </button>
        </div>
        
        <div className="attendance-actions">
          <button className="btn btn-success" onClick={() => handleMarkAll('present')}>
            <i className="fa fa-check"></i> Mark All Present
          </button>
          <button className="btn btn-danger" onClick={() => handleMarkAll('absent')}>
            <i className="fa fa-times"></i> Mark All Absent
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const status = getStudentStatus(student.rollNumber);
                return (
                  <tr key={student.id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>
                      <span className={`status-badge status-${status}`}>
                        {status === 'not-marked' ? 'Not Marked' : status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleMarkAttendance(student.rollNumber, 'present')}
                          disabled={status === 'present'}
                        >
                          <i className="fa fa-check"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleMarkAttendance(student.rollNumber, 'absent')}
                          disabled={status === 'absent'}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
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
};

export default AttendanceManagement;