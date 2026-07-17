import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from config.database import db
from models import Feedback
from middleware.auth import role_required

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.post('')
@role_required('student', 'teacher', 'admin')
def submit_feedback():
    verify_jwt_in_request()
    identity_raw = get_jwt_identity()
    identity = json.loads(identity_raw) if isinstance(identity_raw, str) else (identity_raw or {})
    user_name = identity.get('name', 'Anonymous')
    role = identity.get('role', 'student')

    data = request.get_json(silent=True) or {}
    category = data.get('category', 'General')
    rating = data.get('rating', 5)
    message = data.get('message', '')

    if not message:
        return jsonify({'message': 'Message is required'}), 400

    try:
        feedback = Feedback(
            student_name=user_name,
            role=role,
            category=category,
            rating=int(rating),
            message=message
        )
        db.session.add(feedback)
        db.session.commit()
        return jsonify({'id': feedback.id, 'message': 'Feedback submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Database error: {str(e)}'}), 500


@feedback_bp.get('')
@role_required('admin')
def get_all_feedback():
    try:
        feedback_list = Feedback.query.order_by(Feedback.created_at.desc()).all()
        return jsonify({
            'feedback': [
                {
                    'id': f.id,
                    'studentName': f.student_name,
                    'role': f.role,
                    'category': f.category,
                    'rating': f.rating,
                    'message': f.message,
                    'createdAt': f.created_at.isoformat() if f.created_at else None
                } for f in feedback_list
            ]
        })
    except Exception as e:
        return jsonify({'message': f'Database error: {str(e)}'}), 500
