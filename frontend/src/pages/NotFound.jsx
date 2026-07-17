import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound({ user }) {
  const home = user?.role === 'teacher' ? '/teacher' : user?.role === 'admin' ? '/admin' : '/student';

  return (
    <div className="feature-card not-found-card">
      <h3>404</h3>
      <p>The page you requested does not exist.</p>
      <Link to={home}>Go to dashboard</Link>
    </div>
  );
}