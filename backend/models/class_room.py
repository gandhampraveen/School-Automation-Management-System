from config.database import db


class ClassRoom(db.Model):
    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    section = db.Column(db.String(10))
    class_teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
