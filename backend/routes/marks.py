from flask import Blueprint, jsonify, request

from config.database import db
from middleware.auth import role_required
from models import Mark

marks_bp = Blueprint('marks', __name__)


@marks_bp.get('')
@role_required('admin', 'teacher', 'student')
def get_marks():
    marks = Mark.query.all()
    return jsonify({
        'marks': [
            {
                'id': mark.id,
                'rollNumber': mark.roll_number,
                'subject': mark.subject,
                'marks': float(mark.marks_obtained),
                'total': float(mark.total_marks),
                'grade': mark.grade,
            }
            for mark in marks
        ]
    })


@marks_bp.post('')
@role_required('admin', 'teacher')
def add_mark():
    data = request.get_json(silent=True) or {}
    required = ['rollNumber', 'subject', 'marks', 'total']
    missing = [field for field in required if not data.get(field)]
    if missing:
        return jsonify({'message': f"Missing fields: {', '.join(missing)}"}), 400

    mark = Mark(
        student_id=data.get('student_id') or 1,
        roll_number=data['rollNumber'],
        subject_id=data.get('subject_id'),
        subject=data['subject'],
        exam_name=data.get('exam_name', 'General Exam'),
        marks_obtained=data['marks'],
        total_marks=data['total'],
        grade=data.get('grade'),
    )
    db.session.add(mark)
    db.session.commit()
    return jsonify({'id': mark.id, 'message': 'Mark recorded'}), 201


@marks_bp.put('/<int:mark_id>')
@role_required('admin', 'teacher')
def update_mark(mark_id):
    mark = Mark.query.get_or_404(mark_id)
    data = request.get_json(silent=True) or {}
    mark.exam_name = data.get('exam_name', mark.exam_name)
    mark.marks_obtained = data.get('marks', mark.marks_obtained)
    mark.total_marks = data.get('total', mark.total_marks)
    mark.roll_number = data.get('rollNumber', mark.roll_number)
    mark.subject = data.get('subject', mark.subject)
    mark.grade = data.get('grade', mark.grade)
    db.session.commit()
    return jsonify({'message': 'Mark updated'})


@marks_bp.delete('/<int:mark_id>')
@role_required('admin', 'teacher')
def delete_mark(mark_id):
    mark = Mark.query.get_or_404(mark_id)
    db.session.delete(mark)
    db.session.commit()
    return jsonify({'message': 'Mark deleted'})
