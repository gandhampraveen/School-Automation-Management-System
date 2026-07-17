import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getReports()
      .then(data => setReport(data.reports || null))
      .catch(err => setError(err.message || 'Failed to load report data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '20px' }}>
        <h3>Analytics & Reports</h3>
        <p>Overview of academic metrics, attendance rates, and financial reports.</p>
      </div>

      {error ? <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p> : null}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading reports...</div>
      ) : report ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          <div className="card" style={{ borderLeft: '5px solid #4a6bbb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>TOTAL STUDENTS</span>
              <i className="fa fa-users" style={{ color: '#4a6bbb', fontSize: '20px' }}></i>
            </div>
            <div style={{ marginTop: '15px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#2c3e50' }}>{report.students}</h2>
              <span style={{ fontSize: '12px', color: '#28a745', fontWeight: '600' }}><i className="fa fa-arrow-up"></i> +4.5% from last month</span>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #28a745', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>TOTAL TEACHERS</span>
              <i className="fa fa-graduation-cap" style={{ color: '#28a745', fontSize: '20px' }}></i>
            </div>
            <div style={{ marginTop: '15px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#2c3e50' }}>{report.teachers}</h2>
              <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>Active in current semester</span>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #17a2b8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>ATTENDANCE RATE</span>
              <i className="fa fa-calendar-check" style={{ color: '#17a2b8', fontSize: '20px' }}></i>
            </div>
            <div style={{ marginTop: '15px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#2c3e50' }}>{report.attendanceRate}%</h2>
              <div style={{ background: '#e9ecef', height: '6px', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#17a2b8', height: '100%', width: `${report.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '5px solid #ffc107', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>FEE COLLECTION RATE</span>
              <i className="fa fa-dollar-sign" style={{ color: '#ffc107', fontSize: '20px' }}></i>
            </div>
            <div style={{ marginTop: '15px' }}>
              <h2 style={{ fontSize: '32px', margin: 0, color: '#2c3e50' }}>{report.feeCollectionRate}%</h2>
              <div style={{ background: '#e9ecef', height: '6px', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ background: '#ffc107', height: '100%', width: `${report.feeCollectionRate}%` }}></div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>No report data loaded.</div>
      )}

      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '15px', fontWeight: '600' }}>Performance Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Student Pass Rate</span>
                  <strong>94%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#28a745', height: '100%', width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Class Average Score</span>
                  <strong>78%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#4a6bbb', height: '100%', width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Teacher Performance Score</span>
                  <strong>88%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#17a2b8', height: '100%', width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', color: '#2c3e50', marginBottom: '15px', fontWeight: '600' }}>Academic Target Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Syllabus Completion</span>
                  <strong>62%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#ffc107', height: '100%', width: '62%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Admissions Target</span>
                  <strong>85%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#28a745', height: '100%', width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', color: '#495057' }}>
                  <span>Parent Satisfaction</span>
                  <strong>90%</strong>
                </div>
                <div style={{ background: '#e9ecef', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#4a6bbb', height: '100%', width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}