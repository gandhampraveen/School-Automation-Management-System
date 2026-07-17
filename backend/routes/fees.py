import json
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from config.database import db
from models import Fee, Student
from middleware.auth import role_required

fees_bp = Blueprint('fees', __name__)


@fees_bp.get('')
@role_required('admin', 'student')
def get_fees():
    verify_jwt_in_request()
    identity_raw = get_jwt_identity()
    identity = json.loads(identity_raw) if isinstance(identity_raw, str) else (identity_raw or {})
    role = identity.get('role')
    user_id = identity.get('id')

    if role == 'student':
        student = Student.query.filter_by(user_id=user_id).first()
        if not student:
            return jsonify({'fees': []})
        student_fees = Fee.query.filter_by(student_id=student.id).all()
        if not student_fees:
            default_fee = Fee(
                student_id=student.id,
                amount_due=5000.00,
                amount_paid=0.00,
                status='pending'
            )
            db.session.add(default_fee)
            db.session.commit()
            student_fees = [default_fee]
            
        return jsonify({
            'fees': [
                {
                    'id': f.id,
                    'studentRollNumber': student.roll_number,
                    'amountDue': float(f.amount_due),
                    'amountPaid': float(f.amount_paid),
                    'status': f.status
                } for f in student_fees
            ]
        })
    else:
        all_fees = Fee.query.all()
        result = []
        for f in all_fees:
            student = Student.query.get(f.student_id)
            roll_number = student.roll_number if student else 'Unknown'
            result.append({
                'id': f.id,
                'studentRollNumber': roll_number,
                'amountDue': float(f.amount_due),
                'amountPaid': float(f.amount_paid),
                'status': f.status
            })
        return jsonify({'fees': result})


@fees_bp.post('')
@role_required('admin')
def add_fee():
    data = request.get_json(silent=True) or {}
    roll_number = data.get('studentRollNumber')
    amount_due = data.get('amountDue', 0)
    amount_paid = data.get('amountPaid', 0)
    status = data.get('status', 'pending')

    student = Student.query.filter_by(roll_number=roll_number).first()
    if not student:
        return jsonify({'message': 'Student roll number not found'}), 404

    fee = Fee(
        student_id=student.id,
        amount_due=amount_due,
        amount_paid=amount_paid,
        status=status
    )
    db.session.add(fee)
    db.session.commit()
    return jsonify({'id': fee.id, 'message': 'Fee record created'}), 201


@fees_bp.post('/<int:fee_id>/pay')
@role_required('student')
def pay_fee(fee_id):
    fee = Fee.query.get_or_404(fee_id)
    fee.status = 'paid'
    fee.amount_paid = fee.amount_due
    db.session.commit()
    return jsonify({'message': 'Payment successful', 'status': 'paid'})

