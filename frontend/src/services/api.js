const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
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
  getTeachers: () => request('/teachers'),
  getAttendance: () => request('/attendance'),
  getMarks: () => request('/marks'),
  getAssignments: () => request('/assignments'),
  getTimetable: () => request('/timetable'),
  getFees: () => request('/fees'),
  getReports: () => request('/reports'),
  getSettings: () => request('/settings'),
};
