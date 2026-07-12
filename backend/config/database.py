import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
jwt = JWTManager()


def seed_if_empty():
    from datetime import date

    from models import Attendance, ClassRoom, Fee, Mark, Student, Subject, Teacher, Timetable, User

    if User.query.first():
        return

    admin = User(username='admin', password_hash='admin123', role='admin', full_name='School Admin')
    teacher_user = User(username='T001', password_hash='password', role='teacher', full_name='Dr. S. Rao')
    student_user = User(username='1001', password_hash='password', role='student', full_name='Rahul Sharma')
    db.session.add_all([admin, teacher_user, student_user])
    db.session.flush()

    teacher = Teacher(user_id=teacher_user.id, employee_code='T001', full_name='Dr. S. Rao', subject='Mathematics')
    classroom = ClassRoom(name='10-A', section='A', class_teacher_id=None)
    subject = Subject(name='Mathematics', code='MATH')
    student = Student(user_id=student_user.id, roll_number='1001', class_name='10-A', full_name='Rahul Sharma')
    db.session.add_all([teacher, classroom, subject, student])
    db.session.flush()

    attendance = Attendance(
        student_id=student.id,
        roll_number='1001',
        subject='Mathematics',
        attendance_date=date(2026, 7, 9),
        status='present',
        remarks='',
    )
    mark = Mark(
        student_id=student.id,
        roll_number='1001',
        subject='Mathematics',
        exam_name='Unit Test 1',
        marks_obtained=85,
        total_marks=100,
        grade='A',
    )
    db.session.add_all([attendance, mark])
    db.session.commit()


def create_app():
    app = Flask(__name__)
    CORS(app)

    db_url = os.getenv('DATABASE_URL', 'sqlite:///school_automation.db')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret-change-me')

    db.init_app(app)
    jwt.init_app(app)

    from routes.assignments import assignments_bp
    from routes.attendance import attendance_bp
    from routes.auth import auth_bp
    from routes.fees import fees_bp
    from routes.reports import reports_bp
    from routes.marks import marks_bp
    from routes.timetable import timetable_bp
    from routes.settings import settings_bp
    from routes.students import students_bp
    from routes.teachers import teachers_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(teachers_bp, url_prefix='/api/teachers')
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(marks_bp, url_prefix='/api/marks')
    app.register_blueprint(assignments_bp, url_prefix='/api/assignments')
    app.register_blueprint(timetable_bp, url_prefix='/api/timetable')
    app.register_blueprint(fees_bp, url_prefix='/api/fees')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')

    with app.app_context():
        from models import Attendance, ClassRoom, Fee, Mark, Student, Subject, Teacher, Timetable, User
        db.create_all()
        seed_if_empty()

    @app.get('/api/health')
    def health_check():
        return jsonify({'status': 'ok', 'service': 'school-automation-backend'})

    return app
