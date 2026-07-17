from flask import Blueprint, jsonify, request
from config.database import db
from middleware.auth import role_required
from models import ClassRoom, Teacher

classes_bp = Blueprint('classes', __name__)

@classes_bp.get('')
@role_required('admin', 'teacher')
def get_classes():
    classes = ClassRoom.query.all()
    result = []
    for cls in classes:
        teacher = Teacher.query.get(cls.class_teacher_id) if cls.class_teacher_id else None
        result.append({
            'id': cls.id,
            'name': cls.name,
            'section': cls.section,
            'classTeacherId': cls.class_teacher_id,
            'classTeacherName': teacher.full_name if teacher else 'None'
        })
    return jsonify({'classes': result})

@classes_bp.post('')
@role_required('admin')
def add_class():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    section = data.get('section')
    class_teacher_id = data.get('classTeacherId')

    if not name:
        return jsonify({'message': 'Missing field: name'}), 400

    # Check unique constraint
    existing = ClassRoom.query.filter_by(name=name).first()
    if existing:
        return jsonify({'message': f"Class room '{name}' already exists"}), 400

    # Verify teacher exists if class_teacher_id is provided
    if class_teacher_id:
        teacher = Teacher.query.get(class_teacher_id)
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404

    cls = ClassRoom(
        name=name,
        section=section,
        class_teacher_id=class_teacher_id
    )
    db.session.add(cls)
    db.session.commit()
    return jsonify({'id': cls.id, 'message': 'Class created'}), 201

@classes_bp.delete('/<int:class_id>')
@role_required('admin')
def delete_class(class_id):
    cls = ClassRoom.query.get_or_404(class_id)
    db.session.delete(cls)
    db.session.commit()
    return jsonify({'message': 'Class deleted'})
