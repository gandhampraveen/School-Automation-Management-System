from flask import Blueprint, jsonify

from middleware.auth import role_required

reports_bp = Blueprint('reports', __name__)


@reports_bp.get('')
@role_required('admin')
def get_reports():
    return jsonify({
        'reports': {
            'students': 420,
            'teachers': 32,
            'attendanceRate': 92,
            'feeCollectionRate': 87,
        }
    })
