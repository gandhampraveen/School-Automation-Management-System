from config.database import db


class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    roll_number = db.Column(db.String(50), unique=True, nullable=False)
    class_name = db.Column(db.String(50), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(20), default='active')
    avatar_url = db.Column(db.String(255), nullable=True)

