from flask import Blueprint, jsonify, request

from config.database import db
from controllers.students_controller import create_student, list_students
from middleware.auth import role_required
from models import Student

students_bp = Blueprint('students', __name__)


@students_bp.get('')
@role_required('admin', 'teacher')
def get_students():
    return jsonify({'students': list_students()})


@students_bp.post('')
@role_required('admin')
def add_student():
    data = request.get_json(silent=True) or {}
    required = ['user_id', 'roll_number', 'class_name', 'full_name']
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({'message': f"Missing fields: {', '.join(missing)}"}), 400

    student = create_student(data)
    return jsonify({'id': student.id, 'message': 'Student created'}), 201


@students_bp.put('/<int:student_id>')
@role_required('admin')
def update_student(student_id):
    student = Student.query.get_or_404(student_id)
    data = request.get_json(silent=True) or {}
    student.roll_number = data.get('roll_number', student.roll_number)
    student.class_name = data.get('class_name', student.class_name)
    student.full_name = data.get('full_name', student.full_name)
    student.status = data.get('status', student.status)
    db.session.commit()
    return jsonify({'message': 'Student updated'})


@students_bp.delete('/<int:student_id>')
@role_required('admin')
def delete_student(student_id):
    student = Student.query.get_or_404(student_id)
    db.session.delete(student)
    db.session.commit()
    return jsonify({'message': 'Student deleted'})
