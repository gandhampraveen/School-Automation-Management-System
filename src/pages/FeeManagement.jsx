import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [studentRollNumber, setStudentRollNumber] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [status, setStatus] = useState('pending');

  const loadData = async () => {
    setLoading(true);
    try {
      const [feesData, studentsData] = await Promise.all([
        api.getFees(),
        api.getStudents()
      ]);
      setFees(feesData.fees || []);
      setStudents(studentsData.students || []);
    } catch (err) {
      setError(err.message || 'Failed to load fee data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setStudentRollNumber('');
    setAmountDue('');
    setAmountPaid('');
    setStatus('pending');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentRollNumber || !amountDue) {
      alert('Please select a student and specify the due amount');
      return;
    }

    try {
      await api.createFee({
        studentRollNumber,
        amountDue: parseFloat(amountDue),
        amountPaid: amountPaid ? parseFloat(amountPaid) : 0,
        status
      });
      alert('Fee invoice created successfully');
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const getStudentName = (rollNo) => {
    const student = students.find(s => s.rollNumber === rollNo);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div>
      <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3>Fee & Invoices Management</h3>
          <p>Track payments, generate invoices, and log dues for school students.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa fa-plus"></i> Create Invoice
        </button>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading fees list...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Amount Due ($)</th>
                  <th>Amount Paid ($)</th>
                  <th>Balance ($)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.length > 0 ? (
                  fees.map((fee) => {
                    const balance = fee.amountDue - fee.amountPaid;
                    return (
                      <tr key={fee.id}>
                        <td>{fee.studentRollNumber}</td>
                        <td>{getStudentName(fee.studentRollNumber)}</td>
                        <td>{fee.amountDue.toLocaleString()}</td>
                        <td>{fee.amountPaid.toLocaleString()}</td>
                        <td>{balance.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge`} style={{
                            background: fee.status === 'paid' ? '#d4edda' :
                                      fee.status === 'partial' ? '#fff3cd' : '#f8d7da',
                            color: fee.status === 'paid' ? '#155724' :
                                   fee.status === 'partial' ? '#856404' : '#721c24'
                          }}>
                            {fee.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>No fee records found.</td>
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
              <h3>Create Fee Invoice</h3>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Select Student:</label>
                <select className="form-control" style={{ width: '100%', height: '40px' }} value={studentRollNumber} onChange={(e) => setStudentRollNumber(e.target.value)} required>
                  <option value="">Choose Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.rollNumber}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount Due ($):</label>
                <input type="number" className="form-control" style={{ width: '100%' }} value={amountDue} onChange={(e) => setAmountDue(e.target.value)} required placeholder="e.g. 12000" min="0" />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount Paid ($):</label>
                <input type="number" className="form-control" style={{ width: '100%' }} value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder="e.g. 8000" min="0" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status:</label>
                <select className="form-control" style={{ width: '100%', height: '40px' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">PENDING</option>
                  <option value="partial">PARTIAL</option>
                  <option value="paid">PAID</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}