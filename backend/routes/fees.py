from flask import Blueprint, jsonify, request

from middleware.auth import role_required

fees = [
    {'id': 1, 'studentRollNumber': '1001', 'amountDue': 12000, 'amountPaid': 8000, 'status': 'partial'},
    {'id': 2, 'studentRollNumber': '1002', 'amountDue': 12000, 'amountPaid': 12000, 'status': 'paid'},
]

fees_bp = Blueprint('fees', __name__)


@fees_bp.get('')
@role_required('admin')
def get_fees():
    return jsonify({'fees': fees})


@fees_bp.post('')
@role_required('admin')
def add_fee():
    data = request.get_json(silent=True) or {}
    fee = {
        'id': len(fees) + 1,
        'studentRollNumber': data.get('studentRollNumber'),
        'amountDue': data.get('amountDue', 0),
        'amountPaid': data.get('amountPaid', 0),
        'status': data.get('status', 'pending'),
    }
    fees.append(fee)
    return jsonify({'id': fee['id'], 'message': 'Fee record created'}), 201
