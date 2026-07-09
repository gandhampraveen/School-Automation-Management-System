from datetime import datetime

from flask import Blueprint, jsonify, request

from config.database import db
from middleware.auth import role_required
from models import Attendance

attendance_bp = Blueprint('attendance', __name__)


@attendance_bp.get('')
@role_required('admin', 'teacher', 'student')
def get_attendance():
    attendance = Attendance.query.all()
    return jsonify({
        'attendance': [
            {
                'id': record.id,
                'rollNumber': record.roll_number,
                'subject': record.subject,
                'date': record.attendance_date.isoformat() if record.attendance_date else None,
                'status': record.status,
                'remarks': record.remarks,
            }
            for record in attendance
        ]
    })


@attendance_bp.post('')
@role_required('admin', 'teacher')
def add_attendance():
    data = request.get_json(silent=True) or {}
    attendance_date = data.get('date') or data.get('attendance_date')
    if not data.get('rollNumber') or not attendance_date or not data.get('status'):
        return jsonify({'message': 'Missing fields'}), 400

    record = Attendance(
        student_id=data.get('student_id') or 1,
        roll_number=data['rollNumber'],
        subject_id=data.get('subject_id'),
        subject=data['subject'],
        attendance_date=datetime.strptime(attendance_date, '%Y-%m-%d').date(),
        status=data['status'],
        remarks=data.get('remarks'),
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'id': record.id, 'message': 'Attendance recorded'}), 201


@attendance_bp.put('/<int:attendance_id>')
@role_required('admin', 'teacher')
def update_attendance(attendance_id):
    record = Attendance.query.get_or_404(attendance_id)
    data = request.get_json(silent=True) or {}
    if data.get('date'):
        record.attendance_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    record.status = data.get('status', record.status)
    record.remarks = data.get('remarks', record.remarks)
    record.roll_number = data.get('rollNumber', record.roll_number)
    record.subject = data.get('subject', record.subject)
    db.session.commit()
    return jsonify({'message': 'Attendance updated'})


@attendance_bp.delete('/<int:attendance_id>')
@role_required('admin', 'teacher')
def delete_attendance(attendance_id):
    record = Attendance.query.get_or_404(attendance_id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Attendance deleted'})
