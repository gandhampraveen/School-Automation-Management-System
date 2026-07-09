from flask import Blueprint, jsonify

from middleware.auth import role_required

settings_bp = Blueprint('settings', __name__)


@settings_bp.get('')
@role_required('admin')
def get_settings():
    return jsonify({
        'settings': {
            'schoolName': 'School Automation System',
            'academicYear': '2026-2027',
            'theme': 'modern',
        }
    })
