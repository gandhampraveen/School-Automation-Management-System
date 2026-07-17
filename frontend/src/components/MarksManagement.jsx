import React, { useState, useEffect } from 'react';
import { db } from '../utils/SchoolDB';

const MarksManagement = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [marks, setMarks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [grade, setGrade] = useState('A');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
  const grades = ['A', 'B', 'C', 'D', 'F'];

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  const loadData = () => {
    setLoading(true);
    try {
      const classStudents = db.getStudentsByClass(selectedClass);
      setStudents(classStudents);
      
      const allMarks = db.getAllMarks();
      const filteredMarks = allMarks.filter(m => 
        classStudents.some(s => s.rollNumber === m.rollNumber)
      );
      setMarks(filteredMarks);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading marks data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarks = () => {
    if (!selectedStudent) {
      alert('Please select a student');
      return;
    }
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    if (!marksObtained || isNaN(marksObtained) || marksObtained < 0) {
      alert('Please enter valid marks');
      return;
    }
    if (!totalMarks || isNaN(totalMarks) || totalMarks <= 0) {
      alert('Please enter valid total marks');
      return;
    }

    const marksValue = parseInt(marksObtained);
    const totalValue = parseInt(totalMarks);

    if (marksValue > totalValue) {
      alert('Marks cannot exceed total marks');
      return;
    }

    const success = db.addMarks({
      rollNumber: selectedStudent,
      subject: subject.trim(),
      marks: marksValue,
      total: totalValue,
      grade
    });

    if (success) {
      loadData();
      // Reset form
      setSelectedStudent('');
      setSubject('Mathematics');
      setMarksObtained('');
      setTotalMarks('100');
      setGrade('A');
      alert('Marks added successfully!');
    } else {
      alert('Error adding marks. Please try again.');
    }
  };

  const handleDeleteMarks = (id) => {
    if (window.confirm('Are you sure you want to delete this mark record?')) {
      try {
        const dbData = db.getDB();
        dbData.marks = dbData.marks.filter(m => m.id !== id);
        db.updateDB(dbData);
        loadData();
        alert('Marks deleted successfully!');
      } catch (error) {
        console.error('Error deleting marks:', error);
        alert('Error deleting marks. Please try again.');
      }
    }
  };

  const handleEditMarks = (record) => {
    setEditingId(record.id);
    setSelectedStudent(record.rollNumber);
    setSubject(record.subject);
    setMarksObtained(record.marks.toString());
    setTotalMarks(record.total.toString());
    setGrade(record.grade);
    
    // Scroll to form
    document.querySelector('.marks-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateMarks = () => {
    if (!selectedStudent || !subject || !marksObtained || !totalMarks) {
      alert('Please fill all fields');
      return;
    }

    const marksValue = parseInt(marksObtained);
    const totalValue = parseInt(totalMarks);

    if (marksValue > totalValue) {
      alert('Marks cannot exceed total marks');
      return;
    }

    try {
      const dbData = db.getDB();
      const index = dbData.marks.findIndex(m => m.id === editingId);
      
      if (index !== -1) {
        dbData.marks[index] = {
          ...dbData.marks[index],
          rollNumber: selectedStudent,
          subject: subject.trim(),
          marks: marksValue,
          total: totalValue,
          grade
        };
        db.updateDB(dbData);
        loadData();
        
        // Reset form
        setEditingId(null);
        setSelectedStudent('');
        setSubject('Mathematics');
        setMarksObtained('');
        setTotalMarks('100');
        setGrade('A');
        alert('Marks updated successfully!');
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      alert('Error updating marks. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedStudent('');
    setSubject('Mathematics');
    setMarksObtained('');
    setTotalMarks('100');
    setGrade('A');
  };

  const getStudentName = (rollNumber) => {
    const student = students.find(s => s.rollNumber === rollNumber);
    return student?.name || 'Unknown';
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#d4edda';
      case 'B': return '#fff3cd';
      case 'C': return '#cce5ff';
      case 'D': return '#f8d7da';
      case 'F': return '#f8d7da';
      default: return '#e2e3e5';
    }
  };

  const getGradeTextColor = (grade) => {
    switch(grade) {
      case 'A': return '#155724';
      case 'B': return '#856404';
      case 'C': return '#004085';
      case 'D': return '#721c24';
      case 'F': return '#721c24';
      default: return '#383d41';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading marks data...</p>
      </div>
    );
  }

  return (
    <div className="marks-management">
      <div className="card">
        <h3>Marks Management</h3>
        
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
          <button className="btn btn-primary" onClick={loadData}>
            <i className="fa fa-refresh"></i> Load
          </button>
        </div>
      </div>

      <div className="card">
        <h4>{editingId ? 'Edit Marks' : 'Add Marks'}</h4>
        <div className="marks-form">
          <div className="form-row">
            <div className="form-group">
              <label>Student:</label>
              <select 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="form-control"
              >
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
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="form-control"
                placeholder="Enter subject"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Marks:</label>
              <input 
                type="number" 
                value={marksObtained} 
                onChange={(e) => setMarksObtained(e.target.value)}
                className="form-control"
                placeholder="Enter marks"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Total:</label>
              <input 
                type="number" 
                value={totalMarks} 
                onChange={(e) => setTotalMarks(e.target.value)}
                className="form-control"
                placeholder="Enter total"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Grade:</label>
              <select 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                className="form-control"
              >
                {grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            {editingId ? (
              <>
                <button className="btn btn-success" onClick={handleUpdateMarks}>
                  <i className="fa fa-save"></i> Update Marks
                </button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                  <i className="fa fa-times"></i> Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleAddMarks}>
                <i className="fa fa-plus"></i> Add Marks
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h4>All Marks</h4>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? (
                marks.map(record => {
                  const percentage = Math.round((record.marks / record.total) * 100);
                  return (
                    <tr key={record.id}>
                      <td>{record.rollNumber}</td>
                      <td>{getStudentName(record.rollNumber)}</td>
                      <td>{record.subject}</td>
                      <td>{record.marks}</td>
                      <td>{record.total}</td>
                      <td>{percentage}%</td>
                      <td>
                        <span className="status-badge" style={{
                          background: getGradeColor(record.grade),
                          color: getGradeTextColor(record.grade)
                        }}>
                          {record.grade}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditMarks(record)}
                            title="Edit"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMarks(record.id)}
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    <i className="fa fa-info-circle" style={{ fontSize: '24px', color: '#6c757d' }}></i>
                    <p style={{ marginTop: '10px', color: '#6c757d' }}>
                      No marks records found for this class
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {marks.length > 0 && (
          <div className="table-footer">
            <span>Total Records: {marks.length}</span>
            <button 
              className="btn btn-success btn-sm"
              onClick={() => {
                const csv = marks.map(m => {
                  const student = students.find(s => s.rollNumber === m.rollNumber);
                  return `${m.rollNumber},${student?.name || 'Unknown'},${m.subject},${m.marks},${m.total},${Math.round((m.marks/m.total)*100)}%,${m.grade}`;
                }).join('\n');
                
                const blob = new Blob([
                  'Roll Number,Student,Subject,Marks,Total,Percentage,Grade\n' + csv
                ], { type: 'text/csv' });
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `marks-${selectedClass}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              <i className="fa fa-download"></i> Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarksManagement;