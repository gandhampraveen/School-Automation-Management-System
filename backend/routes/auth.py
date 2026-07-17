from flask import Blueprint, jsonify, request

from controllers.auth_controller import authenticate_user, register_user, google_auth_user

auth_bp = Blueprint('auth', __name__)


@auth_bp.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    identifier = data.get('identifier', '')
    password = data.get('password', '')
    role = data.get('role', 'student')

    if not identifier or not password:
        return jsonify({'message': 'Missing credentials'}), 400

    auth_result = authenticate_user(identifier, password, role)
    if not auth_result:
        return jsonify({'message': 'Invalid credentials'}), 401

    return jsonify(auth_result)


@auth_bp.post('/register')
def register():
    data = request.get_json(silent=True) or {}
    result, status_code = register_user(data)
    return jsonify(result), status_code


@auth_bp.post('/google')
def google_auth():
    data = request.get_json(silent=True) or {}
    result, status_code = google_auth_user(data)
    return jsonify(result), status_code

