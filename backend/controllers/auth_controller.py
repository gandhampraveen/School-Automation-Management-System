from flask_jwt_extended import create_access_token

from models import User


def authenticate_user(identifier, password, role):
    user = User.query.filter_by(username=identifier, password_hash=password, role=role).first()
    if not user:
        return None

    token = create_access_token(identity={'id': user.id, 'role': user.role, 'name': user.full_name})
    return {
        'token': token,
        'user': {
            'id': user.id,
            'name': user.full_name,
            'role': user.role,
            'username': user.username,
        },
    }
