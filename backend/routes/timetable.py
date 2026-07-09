from flask import Blueprint, jsonify

timetable_bp = Blueprint('timetable', __name__)


@timetable_bp.get('')
def get_timetable():
    return jsonify({
        'timetable': [
            {'id': 1, 'time': '09:00-10:00', 'day': 'Monday', 'subject': 'Mathematics', 'room': 'A1'},
            {'id': 2, 'time': '10:00-11:00', 'day': 'Monday', 'subject': 'Science', 'room': 'B1'},
        ]
    })
