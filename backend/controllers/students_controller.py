from config.database import db
from models import Student


def list_students():
    students = Student.query.all()
    return [
        {
            'id': student.id,
            'rollNumber': student.roll_number,
            'name': student.full_name,
            'class': student.class_name,
            'status': student.status,
        }
        for student in students
    ]


def create_student(data):
    student = Student(
        user_id=data['user_id'],
        roll_number=data['roll_number'],
        class_name=data['class_name'],
        full_name=data['full_name'],
        status=data.get('status', 'active'),
    )
    db.session.add(student)
    db.session.commit()
    return student
