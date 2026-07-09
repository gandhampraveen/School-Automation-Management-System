const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function request(path, options = {}) {
  const storedUser = localStorage.getItem('schoolUser');
  const token = storedUser ? JSON.parse(storedUser).token : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

export const api = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getStudents: () => request('/students'),
  createStudent: (student) => request('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  }),
  updateStudent: (id, student) => request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  }),
  deleteStudent: (id) => request(`/students/${id}`, {
    method: 'DELETE',
  }),
  getTeachers: () => request('/teachers'),
  getAttendance: () => request('/attendance'),
  createAttendance: (attendance) => request('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendance),
  }),
  getMarks: () => request('/marks'),
  createMark: (mark) => request('/marks', {
    method: 'POST',
    body: JSON.stringify(mark),
  }),
  getTimetable: () => request('/timetable'),
  getAssignments: () => request('/assignments'),
};