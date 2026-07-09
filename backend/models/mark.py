from config.database import db


class Mark(db.Model):
    __tablename__ = 'marks'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    roll_number = db.Column(db.String(50), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'))
    subject = db.Column(db.String(100), nullable=False)
    exam_name = db.Column(db.String(100), nullable=False)
    marks_obtained = db.Column(db.Numeric(5, 2), nullable=False)
    total_marks = db.Column(db.Numeric(5, 2), nullable=False)
    grade = db.Column(db.String(5))
