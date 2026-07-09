from flask import Blueprint, jsonify, request

from config.database import db
from middleware.auth import role_required
from models import Teacher

teachers_bp = Blueprint('teachers', __name__)


@teachers_bp.get('')
@role_required('admin', 'teacher')
def get_teachers():
    teachers = Teacher.query.all()
    return jsonify({
        'teachers': [
            {
                'id': teacher.id,
                'employeeCode': teacher.employee_code,
                'name': teacher.full_name,
                'subject': teacher.subject,
            }
            for teacher in teachers
        ]
    })


@teachers_bp.post('')
@role_required('admin')
def add_teacher():
    data = request.get_json(silent=True) or {}
    required = ['user_id', 'employee_code', 'full_name', 'subject']
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({'message': f"Missing fields: {', '.join(missing)}"}), 400

    teacher = Teacher(
        user_id=data['user_id'],
        employee_code=data['employee_code'],
        full_name=data['full_name'],
        subject=data['subject'],
    )
    db.session.add(teacher)
    db.session.commit()
    return jsonify({'id': teacher.id, 'message': 'Teacher created'}), 201


@teachers_bp.put('/<int:teacher_id>')
@role_required('admin')
def update_teacher(teacher_id):
    teacher = Teacher.query.get_or_404(teacher_id)
    data = request.get_json(silent=True) or {}
    teacher.employee_code = data.get('employee_code', teacher.employee_code)
    teacher.full_name = data.get('full_name', teacher.full_name)
    teacher.subject = data.get('subject', teacher.subject)
    db.session.commit()
    return jsonify({'message': 'Teacher updated'})


@teachers_bp.delete('/<int:teacher_id>')
@role_required('admin')
def delete_teacher(teacher_id):
    teacher = Teacher.query.get_or_404(teacher_id)
    db.session.delete(teacher)
    db.session.commit()
    return jsonify({'message': 'Teacher deleted'})
