import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function FeedbackManagement() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const response = await api.getFeedback();
      setFeedbackList(response.feedback || []);
    } catch (err) {
      setError(err.message || 'Failed to load feedback logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // Compute metrics
  const totalReviews = feedbackList.length;
  const averageRating = totalReviews 
    ? (feedbackList.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1) 
    : '0.0';

  const categoryCounts = feedbackList.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '20px' }}>
        <h3>Feedback & Portal Reviews</h3>
        <p>Review feedback, ratings, and portal suggestions submitted by students and teachers.</p>
      </div>

      {error && <p className="error-text" style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading reviews...</div>
      ) : (
        <>
          {/* Summary metrics widgets */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div className="dashboard-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Average Rating</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{averageRating}</h3>
                <div style={{ color: '#fbbf24', fontSize: '1.2rem' }}>
                  <i className="fa fa-star"></i>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Out of 5.0 stars</span>
            </div>

            <div className="dashboard-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Submissions</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{totalReviews}</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Active student & teacher reviews</span>
            </div>

            <div className="dashboard-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Categories</p>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <div>Academics: {categoryCounts['Academics'] || 0}</div>
                <div>Facilities: {categoryCounts['Facilities'] || 0}</div>
                <div>Teachers: {categoryCounts['Teachers'] || 0}</div>
                <div>General: {categoryCounts['General'] || 0}</div>
              </div>
            </div>
          </div>

          {/* Feedback Card List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {feedbackList.length > 0 ? (
              feedbackList.map((feedback) => (
                <div 
                  key={feedback.id} 
                  style={{
                    background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                    display: 'flex', flexDirection: 'column', gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#eff6ff', color: '#2563eb', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                      }}>
                        {feedback.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>{feedback.studentName}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Role: <strong>{feedback.role.toUpperCase()}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        background: '#fef9c3', color: '#ca8a04', padding: '4px 10px',
                        borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {feedback.category}
                      </span>
                      <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className={i < feedback.rating ? "fa fa-star" : "far fa-star"}></i>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    "{feedback.message}"
                  </p>
                  
                  {feedback.createdAt && (
                    <div style={{ alignSelf: 'flex-end', fontSize: '0.75rem', color: '#94a3b8' }}>
                      Submitted at: {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
                No feedback submissions found in the database.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
