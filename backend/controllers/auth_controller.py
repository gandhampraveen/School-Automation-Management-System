import json
from flask_jwt_extended import create_access_token

from config.database import db
from models import User, Student, Teacher


def authenticate_user(identifier, password, role):
    user = User.query.filter_by(username=identifier, password_hash=password, role=role).first()
    if not user:
        return None

    # Resolve rollNumber/employee_code and avatarUrl
    roll_number = user.username
    profile_avatar = None
    
    if role == 'student':
        student_profile = Student.query.filter_by(user_id=user.id).first()
        if student_profile:
            roll_number = student_profile.roll_number
            profile_avatar = student_profile.avatar_url
    elif role == 'teacher':
        teacher_profile = Teacher.query.filter_by(user_id=user.id).first()
        if teacher_profile:
            roll_number = teacher_profile.employee_code
            profile_avatar = teacher_profile.avatar_url

    identity_payload = json.dumps({'id': user.id, 'role': user.role, 'name': user.full_name})
    token = create_access_token(identity=identity_payload)
    return {
        'token': token,
        'user': {
            'id': user.id,
            'name': user.full_name,
            'role': user.role,
            'username': user.username,
            'rollNumber': roll_number,
            'avatarUrl': profile_avatar
        },
    }



def register_user(data):
    role = data.get('role')
    username = data.get('username')  # Student: roll number, Teacher: employee code
    password = data.get('password')
    full_name = data.get('full_name')

    if not role or not username or not password or not full_name:
        return {'message': 'Missing required fields'}, 400

    if role not in ['student', 'teacher']:
        return {'message': 'Invalid role'}, 400

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return {'message': 'Username/ID already exists'}, 400

    try:
        new_user = User(username=username, password_hash=password, role=role, full_name=full_name)
        db.session.add(new_user)
        db.session.flush()  # to populate new_user.id

        if role == 'student':
            class_name = data.get('class_name', '10-A')
            new_student = Student(user_id=new_user.id, roll_number=username, class_name=class_name, full_name=full_name)
            db.session.add(new_student)
        elif role == 'teacher':
            subject = data.get('subject', 'General')
            new_teacher = Teacher(user_id=new_user.id, employee_code=username, full_name=full_name, subject=subject)
            db.session.add(new_teacher)

        db.session.commit()
        return {
            'message': 'Registration successful',
            'user': {
                'id': new_user.id,
                'name': new_user.full_name,
                'role': new_user.role,
                'username': new_user.username
            }
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'message': f'Error registering user: {str(e)}'}, 500


def google_auth_user(data):
    email = data.get('email')
    name = data.get('name')
    avatar_url = data.get('avatar_url')
    role = data.get('role', 'student')

    if not email or not name:
        return {'message': 'Missing email or name from Google token'}, 400

    # Clean username derived from Gmail
    username = email.split('@')[0]

    # Check if user already exists
    user = User.query.filter_by(username=username).first()

    if not user:
        # Register new user from Google details
        try:
            user = User(username=username, password_hash='google-oauth-managed', role=role, full_name=name)
            db.session.add(user)
            db.session.flush()

            if role == 'student':
                class_name = data.get('class_name', '10-A')
                student = Student(user_id=user.id, roll_number=username, class_name=class_name, full_name=name, avatar_url=avatar_url)
                db.session.add(student)
            elif role == 'teacher':
                subject = data.get('subject', 'General')
                teacher = Teacher(user_id=user.id, employee_code=username, full_name=name, subject=subject, avatar_url=avatar_url)
                db.session.add(teacher)

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error registering Google user: {str(e)}'}, 500

    # Authenticate and sign token
    identity_payload = json.dumps({'id': user.id, 'role': user.role, 'name': user.full_name})
    token = create_access_token(identity=identity_payload)

    # Resolve roll number or employee code
    roll_number = username
    # Check if student/teacher profile exists to pull specific photo
    student_profile = Student.query.filter_by(user_id=user.id).first()
    teacher_profile = Teacher.query.filter_by(user_id=user.id).first()
    profile_avatar = student_profile.avatar_url if student_profile else (teacher_profile.avatar_url if teacher_profile else avatar_url)

    return {
        'token': token,
        'user': {
            'id': user.id,
            'name': user.full_name,
            'role': user.role,
            'username': user.username,
            'rollNumber': roll_number,
            'avatarUrl': profile_avatar
        }
    }, 200

