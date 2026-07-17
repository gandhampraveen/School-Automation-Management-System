import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [classTeacherId, setClassTeacherId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [classesData, teachersData] = await Promise.all([
        api.getClasses(),
        api.getTeachers(),
      ]);
      setClasses(classesData.classes || []);
      setTeachers(teachersData.teachers || []);
    } catch (err) {
      setError(err.message || 'Failed to load class data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setSection('');
    setClassTeacherId('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !section) {
      alert('Please fill out Class Name and Section');
      return;
    }

    try {
      await api.createClass({
        name,
        section,
        classTeacherId: classTeacherId ? parseInt(classTeacherId) : null
      });
      alert('Class created successfully');
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class room?')) return;
    try {
      await api.deleteClass(id);
      alert('Class deleted successfully');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete class');
    }
  };

  return (
    <div>
      <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Class Room Management</h3>
          <p>Configure classes, sections, and assign class teachers.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa fa-plus"></i> Add Class
        </button>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading class rooms...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Section</th>
                  <th>Class Teacher</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.name}</td>
                      <td>{cls.section}</td>
                      <td>{cls.classTeacherName || 'None'}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleDelete(cls.id)}>
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No class rooms registered yet.</td>
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
              <h3>Add New Class Room</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Class Name:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. 10-A or 12-B" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Section:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={section} onChange={(e) => setSection(e.target.value)} required placeholder="e.g. A or B" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Class Teacher:</label>
                <select className="form-control" style={{ width: '100%', height: '40px' }} value={classTeacherId} onChange={(e) => setClassTeacherId(e.target.value)}>
                  <option value="">Select Class Teacher</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name || t.full_name} ({t.subject})</option>
                  ))}
                </select>
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