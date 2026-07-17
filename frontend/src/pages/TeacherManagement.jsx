import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  // Form fields
  const [userId, setUserId] = useState('2');
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const data = await api.getTeachers();
      setTeachers(data.teachers || []);
    } catch (err) {
      setError(err.message || 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setUserId('2');
    setEmployeeCode('');
    setFullName('');
    setSubject('');
    setShowModal(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setUserId('2'); // Hardcoded default as it's not present in GET /teachers
    setEmployeeCode(teacher.employeeCode || teacher.employee_code || '');
    setFullName(teacher.name || teacher.full_name || '');
    setSubject(teacher.subject || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeCode || !fullName || !subject) {
      alert('Please fill out all fields');
      return;
    }

    try {
      if (editingTeacher) {
        // Update teacher
        await api.updateTeacher(editingTeacher.id, {
          employee_code: employeeCode,
          full_name: fullName,
          subject
        });
        alert('Teacher updated successfully');
      } else {
        // Create teacher
        await api.createTeacher({
          user_id: parseInt(userId),
          employee_code: employeeCode,
          full_name: fullName,
          subject
        });
        alert('Teacher created successfully');
      }
      setShowModal(false);
      loadTeachers();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await api.deleteTeacher(id);
      alert('Teacher deleted successfully');
      loadTeachers();
    } catch (err) {
      alert(err.message || 'Failed to delete teacher');
    }
  };

  return (
    <div>
      <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Teacher Management</h3>
          <p>Add, edit, and assign teachers from the database.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa fa-plus"></i> Add Teacher
        </button>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading teachers...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.employeeCode || teacher.employee_code}</td>
                      <td>{teacher.name || teacher.full_name}</td>
                      <td>{teacher.subject}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-warning btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleOpenEdit(teacher)}>
                            <i className="fa fa-edit"></i> Edit
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleDelete(teacher.id)}>
                            <i className="fa fa-trash"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No teachers loaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white', padding: '25px', borderRadius: '12px',
            width: '90%', maxWidth: '450px'
          }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {!editingTeacher && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>User ID (Fk to Users):</label>
                  <input type="number" className="form-control" style={{ width: '100%' }} value={userId} onChange={(e) => setUserId(e.target.value)} required />
                </div>
              )}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Employee Code:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} required placeholder="e.g. T002" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="e.g. Prof. Kumar" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Subject:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Physics" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}