import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await api.getSubjects();
      setSubjects(data.subjects || []);
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setCode('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Please fill out Subject Name and Subject Code');
      return;
    }

    try {
      await api.createSubject({
        name,
        code
      });
      alert('Subject created successfully');
      setShowModal(false);
      loadSubjects();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await api.deleteSubject(id);
      alert('Subject deleted successfully');
      loadSubjects();
    } catch (err) {
      alert(err.message || 'Failed to delete subject');
    }
  };

  return (
    <div>
      <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Subject Management</h3>
          <p>Define courses, course codes, and curriculum mappings.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa fa-plus"></i> Add Subject
        </button>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading subjects...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.name}</td>
                      <td>{sub.code}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleDelete(sub.id)}>
                          <i className="fa fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>No subjects defined yet.</td>
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
              <h3>Add New Subject</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Subject Name:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Science or English" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Subject Code:</label>
                <input type="text" className="form-control" style={{ width: '100%' }} value={code} onChange={(e) => setCode(e.target.value)} required placeholder="e.g. SCI or ENG" />
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