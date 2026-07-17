from flask import Blueprint, jsonify, request
from config.database import db
from middleware.auth import role_required
from models import Subject

subjects_bp = Blueprint('subjects', __name__)

@subjects_bp.get('')
@role_required('admin', 'teacher')
def get_subjects():
    subjects = Subject.query.all()
    result = [
        {
            'id': sub.id,
            'name': sub.name,
            'code': sub.code
        }
        for sub in subjects
    ]
    return jsonify({'subjects': result})

@subjects_bp.post('')
@role_required('admin')
def add_subject():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    code = data.get('code')

    if not name or not code:
        return jsonify({'message': 'Missing fields: name or code'}), 400

    # Check unique constraint
    existing_name = Subject.query.filter_by(name=name).first()
    if existing_name:
        return jsonify({'message': f"Subject with name '{name}' already exists"}), 400

    existing_code = Subject.query.filter_by(code=code).first()
    if existing_code:
        return jsonify({'message': f"Subject with code '{code}' already exists"}), 400

    sub = Subject(
        name=name,
        code=code
    )
    db.session.add(sub)
    db.session.commit()
    return jsonify({'id': sub.id, 'message': 'Subject created'}), 201

@subjects_bp.delete('/<int:subject_id>')
@role_required('admin')
def delete_subject(subject_id):
    sub = Subject.query.get_or_404(subject_id)
    db.session.delete(sub)
    db.session.commit()
    return jsonify({'message': 'Subject deleted'})
