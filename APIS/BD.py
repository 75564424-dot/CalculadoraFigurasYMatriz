from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Inicializar la base de datos
db = SQLAlchemy()

# =========================
# MODELOS ORM
# =========================
class User(db.Model):
    __tablename__ = 'usuarios'

    email = db.Column(db.String(120), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    tema_preferido = db.Column(db.String(20), default='claro')
    rol = db.Column(db.String(20), default='usuario')  # NUEVO: 'usuario' o 'admin'
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    historial = db.relationship('Historial', backref='usuario', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'email': self.email,
            'nombre': self.nombre,
            'tema_preferido': self.tema_preferido,
            'rol': self.rol,
            'fecha_registro': self.fecha_registro.isoformat()
        }


class Historial(db.Model):
    __tablename__ = 'historial'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), db.ForeignKey('usuarios.email'), nullable=False)
    calculo = db.Column(db.Text, nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'calculo': self.calculo,
            'fecha': self.fecha.isoformat()
        }

# =========================
# FUNCIONES DE INICIALIZACIÓN
# =========================
def init_db(app):
    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Configuración del Admin
        admin_email = 'admin@gmail.com'
        admin_nombre = 'Administrador'
        admin_password = 'admin123'
        admin_tema = 'oscuro'
        admin_rol = 'admin'

        # Verificar si ya existe el admin
        admin = db.session.get(User, admin_email)

        if not admin:
            # Crear un nuevo admin
            admin_user = User(
                email=admin_email,
                nombre=admin_nombre,
                password=admin_password,
                tema_preferido=admin_tema,
                rol=admin_rol
            )
            db.session.add(admin_user)
            db.session.commit()
            print(f"Admin creado: {admin_email}")
        else:
            print(f"Admin ya existe: {admin_email}")