from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request


def role_required(*allowed_roles):
    def decorator(route_handler):
        @wraps(route_handler)
        def wrapped(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity() or {}
            if identity.get('role') not in allowed_roles:
                return jsonify({'message': 'Forbidden'}), 403
            return route_handler(*args, **kwargs)

        return wrapped

    return decorator
