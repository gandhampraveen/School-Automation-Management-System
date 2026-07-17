import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getStudents()
      .then((data) => setStudents(data.students || []))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <div className="section-heading">
        <h3>Student Management</h3>
        <p>Connects to GET /students, POST /students, PUT /students/:id, and DELETE /students/:id.</p>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <div className="simple-table">
        <div className="simple-table-row simple-table-head">
          <span>Roll No</span>
          <span>Name</span>
          <span>Class</span>
          <span>Status</span>
        </div>
        {students.length ? students.map((student) => (
          <div className="simple-table-row" key={student.id}>
            <span>{student.rollNumber || student.studentNumber}</span>
            <span>{student.name}</span>
            <span>{student.className || student.class}</span>
            <span>{student.status || 'Active'}</span>
          </div>
        )) : <div className="simple-table-row"><span>No students loaded yet.</span></div>}
      </div>
    </div>
  );
}