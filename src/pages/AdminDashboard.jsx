import React from 'react';

const cards = [
  { label: 'Students', value: '1,200' },
  { label: 'Teachers', value: '75' },
  { label: 'Classes', value: '24' },
  { label: 'Fee Dues', value: '18' },
];

export default function AdminDashboard() {
  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <article key={card.label} className="dashboard-card">
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
      <article className="dashboard-card dashboard-card-wide">
        <h3>System Overview</h3>
        <p>The admin area is ready to connect to backend student, teacher, attendance, marks, fee, and timetable APIs.</p>
      </article>
    </div>
  );
}