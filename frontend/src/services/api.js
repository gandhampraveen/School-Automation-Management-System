const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:5000/api');

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
  register: (userDetails) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userDetails),
  }),
  loginGoogle: (credentials) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  submitFeedback: (feedback) => request('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedback),
  }),
  getFeedback: () => request('/feedback'),
  payFee: (feeId) => request(`/fees/${feeId}/pay`, {
    method: 'POST',
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
  createTeacher: (teacher) => request('/teachers', {
    method: 'POST',
    body: JSON.stringify(teacher),
  }),
  updateTeacher: (id, teacher) => request(`/teachers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(teacher),
  }),
  deleteTeacher: (id) => request(`/teachers/${id}`, {
    method: 'DELETE',
  }),
  getClasses: () => request('/classes'),
  createClass: (cls) => request('/classes', {
    method: 'POST',
    body: JSON.stringify(cls),
  }),
  deleteClass: (id) => request(`/classes/${id}`, {
    method: 'DELETE',
  }),
  getSubjects: () => request('/subjects'),
  createSubject: (subject) => request('/subjects', {
    method: 'POST',
    body: JSON.stringify(subject),
  }),
  deleteSubject: (id) => request(`/subjects/${id}`, {
    method: 'DELETE',
  }),
  getFees: () => request('/fees'),
  createFee: (fee) => request('/fees', {
    method: 'POST',
    body: JSON.stringify(fee),
  }),
  getReports: () => request('/reports'),
  getSettings: () => request('/settings'),
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