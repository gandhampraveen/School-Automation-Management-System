// SchoolDB.js - Complete Database Management System

/**
 * Simulated database using localStorage
 * This class handles all data operations for the School Management System
 */
export class SchoolDb {
  constructor() {
    this.initDB();
  }

  /**
   * Initialize the database with default data if it doesn't exist
   */
  initDB() {
    if (!localStorage.getItem('schoolDb')) {
      const initialData = {
        users: [
          // Teachers
          { id: 1, teacherId: 'T001', password: 'password', name: 'Dr. S. Rao', subject: 'Mathematics', email: 's.rao@school.edu', type: 'teacher' },
          { id: 2, teacherId: 'T002', password: 'password', name: 'Ms. P. Verma', subject: 'Science', email: 'p.verma@school.edu', type: 'teacher' },
          { id: 3, teacherId: 'T003', password: 'password', name: 'Mr. R. Khan', subject: 'English', email: 'r.khan@school.edu', type: 'teacher' },
          { id: 4, teacherId: 'T004', password: 'password', name: 'Mrs. S. Das', subject: 'Social Studies', email: 's.das@school.edu', type: 'teacher' },
          
          // Students - Class 10-A
          { id: 5, rollNumber: '1001', password: 'password', name: 'Rahul Sharma', class: '10-A', email: 'rahul@school.edu', type: 'student' },
          { id: 6, rollNumber: '1002', password: 'password', name: 'Priya Patel', class: '10-A', email: 'priya@school.edu', type: 'student' },
          { id: 7, rollNumber: '1003', password: 'password', name: 'Amit Kumar', class: '10-A', email: 'amit@school.edu', type: 'student' },
          { id: 8, rollNumber: '1004', password: 'password', name: 'Lakshmi Devi', class: '10-A', email: 'lakshmi@school.edu', type: 'student' },
          { id: 9, rollNumber: '1005', password: 'password', name: 'Surya Kumar', class: '10-A', email: 'surya@school.edu', type: 'student' },
          { id: 10, rollNumber: '1006', password: 'password', name: 'Pavan Reddy', class: '10-A', email: 'pavan@school.edu', type: 'student' },
          { id: 11, rollNumber: '1007', password: 'password', name: 'Anjali Singh', class: '10-A', email: 'anjali@school.edu', type: 'student' },
          { id: 12, rollNumber: '1008', password: 'password', name: 'Arun Mehta', class: '10-A', email: 'arun@school.edu', type: 'student' },
          { id: 13, rollNumber: '1009', password: 'password', name: 'Kavya Nair', class: '10-A', email: 'kavya@school.edu', type: 'student' },
          { id: 14, rollNumber: '1010', password: 'password', name: 'Rohit Sharma', class: '10-A', email: 'rohit@school.edu', type: 'student' },
          
          // Students - Class 10-B
          { id: 15, rollNumber: '1011', password: 'password', name: 'Sneha Patel', class: '10-B', email: 'sneha@school.edu', type: 'student' },
          { id: 16, rollNumber: '1012', password: 'password', name: 'Vikram Joshi', class: '10-B', email: 'vikram@school.edu', type: 'student' },
          { id: 17, rollNumber: '1013', password: 'password', name: 'Priyanka Das', class: '10-B', email: 'priyanka@school.edu', type: 'student' },
          { id: 18, rollNumber: '1014', password: 'password', name: 'Rajesh Iyer', class: '10-B', email: 'rajesh@school.edu', type: 'student' },
          { id: 19, rollNumber: '1015', password: 'password', name: 'Divya Menon', class: '10-B', email: 'divya@school.edu', type: 'student' },
          
          // Students - Class 11-A
          { id: 20, rollNumber: '1101', password: 'password', name: 'Abhishek Gupta', class: '11-A', email: 'abhishek@school.edu', type: 'student' },
          { id: 21, rollNumber: '1102', password: 'password', name: 'Akshay Sharma', class: '11-A', email: 'akshay@school.edu', type: 'student' },
          { id: 22, rollNumber: '1103', password: 'password', name: 'Ishita Sharma', class: '11-A', email: 'ishita@school.edu', type: 'student' },
          { id: 23, rollNumber: '1104', password: 'password', name: 'Kriti Singh', class: '11-A', email: 'kriti@school.edu', type: 'student' },
          { id: 24, rollNumber: '1105', password: 'password', name: 'Mansi Patel', class: '11-A', email: 'mansi@school.edu', type: 'student' },
          
          // Students - Class 11-B
          { id: 25, rollNumber: '1106', password: 'password', name: 'Aditya Singh', class: '11-B', email: 'aditya@school.edu', type: 'student' },
          { id: 26, rollNumber: '1107', password: 'password', name: 'Anmol Gupta', class: '11-B', email: 'anmol@school.edu', type: 'student' },
          { id: 27, rollNumber: '1108', password: 'password', name: 'Ayush Sharma', class: '11-B', email: 'ayush@school.edu', type: 'student' },
          { id: 28, rollNumber: '1109', password: 'password', name: 'Gautam Singh', class: '11-B', email: 'gautam@school.edu', type: 'student' },
          { id: 29, rollNumber: '1110', password: 'password', name: 'Himanshu Gupta', class: '11-B', email: 'himanshu@school.edu', type: 'student' }
        ],
        
        attendance: [
          // Attendance records
          { id: 1, rollNumber: '1001', date: '2024-01-15', subject: 'Mathematics', status: 'present', remarks: '' },
          { id: 2, rollNumber: '1001', date: '2024-01-15', subject: 'Science', status: 'present', remarks: '' },
          { id: 3, rollNumber: '1001', date: '2024-01-16', subject: 'Mathematics', status: 'absent', remarks: 'Sick' },
          { id: 4, rollNumber: '1002', date: '2024-01-15', subject: 'Mathematics', status: 'present', remarks: '' },
          { id: 5, rollNumber: '1002', date: '2024-01-16', subject: 'Science', status: 'present', remarks: '' },
          { id: 6, rollNumber: '1003', date: '2024-01-15', subject: 'Mathematics', status: 'present', remarks: '' },
          { id: 7, rollNumber: '1003', date: '2024-01-16', subject: 'Mathematics', status: 'absent', remarks: 'Late' },
          { id: 8, rollNumber: '1004', date: '2024-01-15', subject: 'Science', status: 'present', remarks: '' },
          { id: 9, rollNumber: '1004', date: '2024-01-16', subject: 'Mathematics', status: 'present', remarks: '' },
          { id: 10, rollNumber: '1005', date: '2024-01-15', subject: 'Mathematics', status: 'absent', remarks: 'Sick' }
        ],
        
        marks: [
          // Marks records
          { id: 1, rollNumber: '1001', subject: 'Mathematics', marks: 85, total: 100, grade: 'A' },
          { id: 2, rollNumber: '1001', subject: 'Science', marks: 78, total: 100, grade: 'B' },
          { id: 3, rollNumber: '1001', subject: 'English', marks: 92, total: 100, grade: 'A' },
          { id: 4, rollNumber: '1002', subject: 'Mathematics', marks: 92, total: 100, grade: 'A' },
          { id: 5, rollNumber: '1002', subject: 'Science', marks: 88, total: 100, grade: 'A' },
          { id: 6, rollNumber: '1002', subject: 'English', marks: 76, total: 100, grade: 'B' },
          { id: 7, rollNumber: '1003', subject: 'Mathematics', marks: 65, total: 100, grade: 'C' },
          { id: 8, rollNumber: '1003', subject: 'Science', marks: 72, total: 100, grade: 'B' },
          { id: 9, rollNumber: '1004', subject: 'Mathematics', marks: 95, total: 100, grade: 'A' },
          { id: 10, rollNumber: '1004', subject: 'Science', marks: 90, total: 100, grade: 'A' }
        ],
        
        assignments: [
          // Assignment records
          { id: 1, title: 'Algebra Problems', subject: 'Mathematics', dueDate: '2024-01-25', status: 'pending', grade: '-' },
          { id: 2, title: 'Chemical Reactions', subject: 'Science', dueDate: '2024-01-28', status: 'submitted', grade: 'A' },
          { id: 3, title: 'English Essay', subject: 'English', dueDate: '2024-01-30', status: 'pending', grade: '-' },
          { id: 4, title: 'Physics Practical', subject: 'Science', dueDate: '2024-02-05', status: 'submitted', grade: 'B' },
          { id: 5, title: 'History Project', subject: 'Social Studies', dueDate: '2024-02-10', status: 'pending', grade: '-' }
        ],
        
        timetable: [
          // Timetable entries
          { id: 1, time: '9:00 - 10:00', monday: 'Mathematics', tuesday: 'Science', wednesday: 'Mathematics', thursday: 'Science', friday: 'Mathematics', saturday: 'Science' },
          { id: 2, time: '10:00 - 11:00', monday: 'Science', tuesday: 'Mathematics', wednesday: 'Science', thursday: 'Mathematics', friday: 'Science', saturday: 'Mathematics' },
          { id: 3, time: '11:00 - 11:30', monday: 'Break', tuesday: 'Break', wednesday: 'Break', thursday: 'Break', friday: 'Break', saturday: 'Break' },
          { id: 4, time: '11:30 - 12:30', monday: 'English', tuesday: 'Social Studies', wednesday: 'English', thursday: 'Social Studies', friday: 'English', saturday: 'Social Studies' },
          { id: 5, time: '12:30 - 1:30', monday: 'Science', tuesday: 'English', wednesday: 'Social Studies', thursday: 'English', friday: 'Social Studies', saturday: 'English' },
          { id: 6, time: '1:30 - 2:00', monday: 'Lunch', tuesday: 'Lunch', wednesday: 'Lunch', thursday: 'Lunch', friday: 'Lunch', saturday: 'Lunch' },
          { id: 7, time: '2:00 - 3:00', monday: 'Social Studies', tuesday: 'Science', wednesday: 'Science', thursday: 'Mathematics', friday: 'Mathematics', saturday: 'Science' },
          { id: 8, time: '3:00 - 4:00', monday: 'Sports', tuesday: 'Sports', wednesday: 'Sports', thursday: 'Sports', friday: 'Sports', saturday: 'Sports' }
        ]
      };
      localStorage.setItem('schoolDB', JSON.stringify(initialData));
    }
  }

  /**
   * Get the entire database
   * @returns {Object} The database object
   */
  getDB() {
    const db = localStorage.getItem('schoolDB');
    if (!db) {
      this.initDB();
      return this.getDB();
    }
    return JSON.parse(db);
  }

  /**
   * Update the entire database
   * @param {Object} data - The updated database object
   */
  updateDB(data) {
    localStorage.setItem('schoolDB', JSON.stringify(data));
  }

  // ==================== AUTHENTICATION METHODS ====================

  /**
   * Authenticate a user
   * @param {string} identifier - Roll number or teacher ID
   * @param {string} password - User password
   * @param {string} userType - 'student' or 'teacher'
   * @returns {Object|null} User object or null if authentication fails
   */
  authenticateUser(identifier, password, userType) {
    const db = this.getDB();
    console.log('Authenticating:', { identifier, password, userType });
    
    if (userType === 'student') {
      return db.users.find(u => 
        u.rollNumber === identifier && 
        u.password === password && 
        u.type === 'student'
      ) || null;
    } else if (userType === 'teacher') {
      return db.users.find(u => 
        u.teacherId === identifier && 
        u.password === password && 
        u.type === 'teacher'
      ) || null;
    }
    return null;
  }

  /**
   * Check if user exists
   * @param {string} identifier - Roll number or teacher ID
   * @param {string} userType - 'student' or 'teacher'
   * @returns {boolean} True if user exists
   */
  userExists(identifier, userType) {
    const db = this.getDB();
    if (userType === 'student') {
      return db.users.some(u => u.rollNumber === identifier && u.type === 'student');
    } else {
      return db.users.some(u => u.teacherId === identifier && u.type === 'teacher');
    }
  }

  // ==================== USER METHODS ====================

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Object|null} User object or null
   */
  getUserById(id) {
    const db = this.getDB();
    return db.users.find(u => u.id === id) || null;
  }

  /**
   * Get user by roll number
   * @param {string} rollNumber - Student roll number
   * @returns {Object|null} User object or null
   */
  getUserByRollNumber(rollNumber) {
    const db = this.getDB();
    return db.users.find(u => u.rollNumber === rollNumber) || null;
  }

  /**
   * Get user by teacher ID
   * @param {string} teacherId - Teacher ID
   * @returns {Object|null} User object or null
   */
  getUserByTeacherId(teacherId) {
    const db = this.getDB();
    return db.users.find(u => u.teacherId === teacherId) || null;
  }

  /**
   * Get all students
   * @returns {Array} Array of student objects
   */
  getStudents() {
    const db = this.getDB();
    return db.users.filter(u => u.type === 'student');
  }

  /**
   * Get students by class
   * @param {string} className - Class name (e.g., '10-A')
   * @returns {Array} Array of student objects
   */
  getStudentsByClass(className) {
    const db = this.getDB();
    return db.users.filter(u => u.type === 'student' && u.class === className);
  }

  /**
   * Get all teachers
   * @returns {Array} Array of teacher objects
   */
  getTeachers() {
    const db = this.getDB();
    return db.users.filter(u => u.type === 'teacher');
  }

  /**
   * Add a new user
   * @param {Object} userData - User data
   * @returns {boolean} True if successful
   */
  addUser(userData) {
    try {
      const db = this.getDB();
      const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
      db.users.push({ id: newId, ...userData });
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {boolean} True if successful
   */
  updateUser(id, userData) {
    try {
      const db = this.getDB();
      const index = db.users.findIndex(u => u.id === id);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...userData };
        this.updateDB(db);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {boolean} True if successful
   */
  deleteUser(id) {
    try {
      const db = this.getDB();
      db.users = db.users.filter(u => u.id !== id);
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // ==================== ATTENDANCE METHODS ====================

  /**
   * Get attendance for a student
   * @param {string} rollNumber - Student roll number
   * @returns {Array} Array of attendance records
   */
  getAttendance(rollNumber) {
    const db = this.getDB();
    return db.attendance.filter(a => a.rollNumber === rollNumber);
  }

  /**
   * Get attendance by date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Array of attendance records
   */
  getAttendanceByDate(date) {
    const db = this.getDB();
    return db.attendance.filter(a => a.date === date);
  }

  /**
   * Get attendance by subject
   * @param {string} subject - Subject name
   * @returns {Array} Array of attendance records
   */
  getAttendanceBySubject(subject) {
    const db = this.getDB();
    return db.attendance.filter(a => a.subject === subject);
  }

  /**
   * Get all attendance records
   * @returns {Array} Array of all attendance records
   */
  getAllAttendance() {
    const db = this.getDB();
    return db.attendance;
  }

  /**
   * Mark attendance for a student
   * @param {Object} attendanceData - Attendance data
   * @returns {boolean} True if successful
   */
  markAttendance(attendanceData) {
    try {
      const db = this.getDB();
      
      // Generate new ID
      const newId = db.attendance.length > 0 
        ? Math.max(...db.attendance.map(a => a.id)) + 1 
        : 1;
      
      console.log('Marking attendance:', attendanceData);
      
      // Check if attendance already exists for this student, date, and subject
      const existingIndex = db.attendance.findIndex(a => 
        a.rollNumber === attendanceData.rollNumber && 
        a.date === attendanceData.date && 
        a.subject === attendanceData.subject
      );
      
      if (existingIndex !== -1) {
        // Update existing record
        db.attendance[existingIndex] = { 
          ...db.attendance[existingIndex], 
          ...attendanceData 
        };
        console.log('Updated existing attendance record');
      } else {
        // Add new record
        db.attendance.push({ 
          id: newId, 
          ...attendanceData 
        });
        console.log('Added new attendance record');
      }
      
      this.updateDB(db);
      console.log('Attendance saved successfully');
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  }

  /**
   * Delete attendance record
   * @param {number} id - Attendance record ID
   * @returns {boolean} True if successful
   */
  deleteAttendance(id) {
    try {
      const db = this.getDB();
      db.attendance = db.attendance.filter(a => a.id !== id);
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return false;
    }
  }

  /**
   * Get attendance statistics for a student
   * @param {string} rollNumber - Student roll number
   * @returns {Object} Attendance statistics
   */
  getAttendanceStats(rollNumber) {
    const attendance = this.getAttendance(rollNumber);
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const totalCount = attendance.length;
    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    
    return {
      present: presentCount,
      absent: totalCount - presentCount,
      total: totalCount,
      rate: attendanceRate
    };
  }

  // ==================== MARKS METHODS ====================

  /**
   * Get marks for a student
   * @param {string} rollNumber - Student roll number
   * @returns {Array} Array of marks records
   */
  getMarks(rollNumber) {
    const db = this.getDB();
    return db.marks.filter(m => m.rollNumber === rollNumber);
  }

  /**
   * Get marks by subject
   * @param {string} subject - Subject name
   * @returns {Array} Array of marks records
   */
  getMarksBySubject(subject) {
    const db = this.getDB();
    return db.marks.filter(m => m.subject === subject);
  }

  /**
   * Get all marks
   * @returns {Array} Array of all marks records
   */
  getAllMarks() {
    const db = this.getDB();
    return db.marks;
  }

  /**
   * Add marks for a student
   * @param {Object} marksData - Marks data
   * @returns {boolean} True if successful
   */
  addMarks(marksData) {
    try {
      const db = this.getDB();
      
      // Generate new ID
      const newId = db.marks.length > 0 
        ? Math.max(...db.marks.map(m => m.id)) + 1 
        : 1;
      
      console.log('Adding marks:', marksData);
      
      // Check if marks already exist for this student and subject
      const existingIndex = db.marks.findIndex(m => 
        m.rollNumber === marksData.rollNumber && 
        m.subject === marksData.subject
      );
      
      if (existingIndex !== -1) {
        // Update existing record
        db.marks[existingIndex] = { 
          ...db.marks[existingIndex], 
          ...marksData 
        };
        console.log('Updated existing marks record');
      } else {
        // Add new record
        db.marks.push({ 
          id: newId, 
          ...marksData 
        });
        console.log('Added new marks record');
      }
      
      this.updateDB(db);
      console.log('Marks saved successfully');
      return true;
    } catch (error) {
      console.error('Error adding marks:', error);
      return false;
    }
  }

  /**
   * Delete marks record
   * @param {number} id - Marks record ID
   * @returns {boolean} True if successful
   */
  deleteMarks(id) {
    try {
      const db = this.getDB();
      db.marks = db.marks.filter(m => m.id !== id);
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error deleting marks:', error);
      return false;
    }
  }

  /**
   * Get marks statistics for a student
   * @param {string} rollNumber - Student roll number
   * @returns {Object} Marks statistics
   */
  getMarksStats(rollNumber) {
    const marks = this.getMarks(rollNumber);
    const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
    const totalPossible = marks.reduce((sum, m) => sum + m.total, 0);
    const average = marks.length > 0 ? Math.round(totalMarks / marks.length) : 0;
    const percentage = totalPossible > 0 ? Math.round((totalMarks / totalPossible) * 100) : 0;
    
    return {
      average,
      percentage,
      totalSubjects: marks.length
    };
  }

  // ==================== ASSIGNMENT METHODS ====================

  /**
   * Get all assignments
   * @param {string} rollNumber - Optional student roll number
   * @returns {Array} Array of assignment objects
   */
  getAssignments(rollNumber = null) {
    const db = this.getDB();
    if (rollNumber) {
      // For future implementation: student-specific assignments
      return db.assignments;
    }
    return db.assignments;
  }

  /**
   * Get assignment by ID
   * @param {number} id - Assignment ID
   * @returns {Object|null} Assignment object or null
   */
  getAssignmentById(id) {
    const db = this.getDB();
    return db.assignments.find(a => a.id === id) || null;
  }

  /**
   * Add a new assignment
   * @param {Object} assignmentData - Assignment data
   * @returns {boolean} True if successful
   */
  addAssignment(assignmentData) {
    try {
      const db = this.getDB();
      
      const newId = db.assignments.length > 0 
        ? Math.max(...db.assignments.map(a => a.id)) + 1 
        : 1;
      
      db.assignments.push({
        id: newId,
        ...assignmentData
      });
      
      this.updateDB(db);
      console.log('Assignment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding assignment:', error);
      return false;
    }
  }

  /**
   * Update assignment status
   * @param {number} assignmentId - Assignment ID
   * @param {string} status - New status
   * @param {string} grade - Optional grade
   * @returns {boolean} True if successful
   */
  updateAssignmentStatus(assignmentId, status, grade = null) {
    try {
      const db = this.getDB();
      const assignment = db.assignments.find(a => a.id === assignmentId);
      
      if (assignment) {
        assignment.status = status;
        if (grade) {
          assignment.grade = grade;
        }
        this.updateDB(db);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating assignment:', error);
      return false;
    }
  }

  /**
   * Delete assignment
   * @param {number} id - Assignment ID
   * @returns {boolean} True if successful
   */
  deleteAssignment(id) {
    try {
      const db = this.getDB();
      db.assignments = db.assignments.filter(a => a.id !== id);
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      return false;
    }
  }

  // ==================== TIMETABLE METHODS ====================

  /**
   * Get timetable
   * @returns {Array} Array of timetable entries
   */
  getTimetable() {
    const db = this.getDB();
    return db.timetable;
  }

  /**
   * Get timetable by day
   * @param {string} day - Day name (e.g., 'monday')
   * @returns {Array} Array of timetable entries
   */
  getTimetableByDay(day) {
    const db = this.getDB();
    return db.timetable.map(slot => ({
      time: slot.time,
      subject: slot[day]
    }));
  }

  /**
   * Update timetable
   * @param {Array} timetableData - Updated timetable data
   * @returns {boolean} True if successful
   */
  updateTimetable(timetableData) {
    try {
      const db = this.getDB();
      db.timetable = timetableData;
      this.updateDB(db);
      return true;
    } catch (error) {
      console.error('Error updating timetable:', error);
      return false;
    }
  }

  // ==================== SEARCH METHODS ====================

  /**
   * Search students by name
   * @param {string} searchTerm - Search term
   * @returns {Array} Array of matching students
   */
  searchStudents(searchTerm) {
    const students = this.getStudents();
    const term = searchTerm.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.rollNumber.includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  }

  /**
   * Search students by class
   * @param {string} className - Class name
   * @returns {Array} Array of students in the class
   */
  searchStudentsByClass(className) {
    return this.getStudentsByClass(className);
  }

  // ==================== CLASS METHODS ====================

  /**
   * Get all unique classes
   * @returns {Array} Array of class names
   */
  getClasses() {
    const students = this.getStudents();
    const classes = [...new Set(students.map(s => s.class))];
    return classes.sort();
  }

  /**
   * Get class statistics
   * @param {string} className - Class name
   * @returns {Object} Class statistics
   */
  getClassStats(className) {
    const students = this.getStudentsByClass(className);
    const totalStudents = students.length;
    
    let totalAttendance = 0;
    let totalMarks = 0;
    let studentsWithData = 0;
    
    students.forEach(student => {
      const attendanceStats = this.getAttendanceStats(student.rollNumber);
      const marksStats = this.getMarksStats(student.rollNumber);
      
      if (attendanceStats.total > 0) {
        totalAttendance += attendanceStats.rate;
        totalMarks += marksStats.average;
        studentsWithData++;
      }
    });
    
    return {
      className,
      totalStudents,
      averageAttendance: studentsWithData > 0 ? Math.round(totalAttendance / studentsWithData) : 0,
      averageMarks: studentsWithData > 0 ? Math.round(totalMarks / studentsWithData) : 0,
      students
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Reset database (for testing)
   */
  resetDB() {
    localStorage.removeItem('schoolDB');
    this.initDB();
    console.log('Database reset successfully');
  }

  /**
   * Export database (for debugging)
   * @returns {Object} Complete database object
   */
  exportDB() {
    return this.getDB();
  }

  /**
   * Import database
   * @param {Object} data - Database data to import
   * @returns {boolean} True if successful
   */
  importDB(data) {
    try {
      localStorage.setItem('schoolDB', JSON.stringify(data));
      console.log('Database imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  /**
   * Get database size
   * @returns {number} Size in bytes
   */
  getDBSize() {
    const db = localStorage.getItem('schoolDB');
    return db ? new Blob([db]).size : 0;
  }

  /**
   * Clear all data (for testing)
   */
  clearDB() {
    localStorage.removeItem('schoolDB');
    console.log('Database cleared');
  }

  /**
   * Get backup
   * @returns {Object} Backup data
   */
  backupDB() {
    const db = this.getDB();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: db
    };
    return backup;
  }

  /**
   * Restore from backup
   * @param {Object} backup - Backup data
   * @returns {boolean} True if successful
   */
  restoreFromBackup(backup) {
    try {
      if (backup && backup.data) {
        this.importDB(backup.data);
        console.log('Database restored from backup');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
export const db = new SchoolDb();

// Export default for easier imports
export default db;