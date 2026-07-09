from flask import Blueprint, jsonify, request

from config.database import db
from middleware.auth import role_required

assignments = []

assignments_bp = Blueprint('assignments', __name__)


@assignments_bp.get('')
@role_required('admin', 'teacher', 'student')
def get_assignments():
    return jsonify({'assignments': assignments})


@assignments_bp.post('')
@role_required('admin', 'teacher')
def add_assignment():
    data = request.get_json(silent=True) or {}
    assignment = {
        'id': len(assignments) + 1,
        'title': data.get('title', 'Untitled Assignment'),
        'subject': data.get('subject', 'General'),
        'dueDate': data.get('dueDate'),
        'status': data.get('status', 'pending'),
        'grade': data.get('grade', '-'),
    }
    assignments.append(assignment)
    return jsonify({'id': assignment['id'], 'message': 'Assignment created'}), 201


@assignments_bp.put('/<int:assignment_id>')
@role_required('admin', 'teacher')
def update_assignment(assignment_id):
    data = request.get_json(silent=True) or {}
    for assignment in assignments:
        if assignment['id'] == assignment_id:
            assignment['title'] = data.get('title', assignment['title'])
            assignment['subject'] = data.get('subject', assignment['subject'])
            assignment['dueDate'] = data.get('dueDate', assignment['dueDate'])
            assignment['status'] = data.get('status', assignment['status'])
            assignment['grade'] = data.get('grade', assignment['grade'])
            return jsonify({'message': 'Assignment updated'})
    return jsonify({'message': 'Assignment not found'}), 404


@assignments_bp.delete('/<int:assignment_id>')
@role_required('admin', 'teacher')
def delete_assignment(assignment_id):
    for index, assignment in enumerate(assignments):
        if assignment['id'] == assignment_id:
            assignments.pop(index)
            return jsonify({'message': 'Assignment deleted'})
    return jsonify({'message': 'Assignment not found'}), 404
