# pip install flask flask-cors flask_sqlalchemy pymysql
# Flask.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)

# =========================
# CONFIGURACIÓN SQLALCHEMY
# =========================
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:alice123@localhost/calculadora_geometrica'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

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
            'rol': self.rol,  # ← AÑADIDO
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
# CREAR TABLAS AL INICIAR (SIN HASH)
# =========================
with app.app_context():
    db.create_all()

    # === CONFIGURACIÓN DEL ADMIN ===
    admin_email = 'admin@gmail.com'
    admin_nombre = 'Administrador'
    admin_password = 'admin123'  
    admin_tema = 'oscuro'
    admin_rol = 'admin'

    # === CORREGIDO: Usar db.session.get() ===
    admin = db.session.get(User, admin_email)

    if not admin:
        # CREAR ADMIN NUEVO
        admin_user = User(
            email=admin_email,
            nombre=admin_nombre,
            password=admin_password,  
            tema_preferido=admin_tema,
            rol=admin_rol
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"ADMIN CREADO → {admin_email} | Contraseña: {admin_password} | Rol: admin")
    
    else:
        # ACTUALIZAR SI ES NECESARIO
        needs_update = False
        
        if admin.rol != admin_rol:
            admin.rol = admin_rol
            needs_update = True
        
        if admin.password != admin_password:
            admin.password = admin_password  
            needs_update = True
        
        if admin.tema_preferido != admin_tema:
            admin.tema_preferido = admin_tema
            needs_update = True

        if needs_update:
            db.session.commit()
            print(f"Admin actualizado: {admin_email}")
        else:
            print(f"Admin ya existe: {admin_email}")

# =========================
# REGISTRO DE USUARIO
# =========================
@app.route('/api/registro', methods=['POST'])
def registrar_usuario():
    try:
        data = request.json
        nombre = data.get('nombre')
        email = data.get('email')
        password = data.get('password')
        tema_preferido = data.get('tema_preferido', 'claro')
        rol = data.get('rol')

        if not all([nombre, email, password]):
            return jsonify({'success': False, 'error': 'Todos los campos son obligatorios'}), 400

        if User.query.get(email):
            return jsonify({'success': False, 'error': 'El email ya está registrado'}), 400

        user = User(
            email=email,
            nombre=nombre,
            password=password,
            tema_preferido=tema_preferido,
            rol=rol
        )
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Usuario registrado exitosamente',
            'usuario': {
                'nombre': nombre,
                'email': email,
                'tema_preferido': tema_preferido,
                'rol': rol
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# LOGIN DE USUARIO
# =========================
@app.route('/api/login', methods=['POST'])
def login_usuario():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'success': False, 'error': 'Email y contraseña son obligatorios'}), 400

        user = User.query.get(email)
        if user and user.password == password:
            historial = [h.to_dict() for h in user.historial]
            return jsonify({
                'success': True,
                'message': 'Login exitoso',
                'usuario': {
                    'nombre': user.nombre,
                    'email': user.email,
                    'tema_preferido': user.tema_preferido,
                    'rol': user.rol,
                    'historial': historial
                }
            })
        else:
            return jsonify({'success': False, 'error': 'Credenciales incorrectas'}), 401

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# ELIMINAR CUENTA
# =========================
@app.route('/api/eliminar-cuenta', methods=['DELETE'])
def eliminar_cuenta():
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({'success': False, 'error': 'Email es obligatorio'}), 400

        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Cuenta eliminada exitosamente'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# GUARDAR EN HISTORIAL
# =========================
@app.route('/api/historial', methods=['POST'])
def guardar_historial():
    try:
        data = request.json
        email = data.get('email')
        calculo = data.get('calculo')

        if not email or not calculo:
            return jsonify({'success': False, 'error': 'Email y cálculo son obligatorios'}), 400

        if not User.query.get(email):
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        entry = Historial(email=email, calculo=calculo)
        db.session.add(entry)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Cálculo agregado al historial'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# OBTENER HISTORIAL
# =========================
@app.route('/api/historial/<email>', methods=['GET'])
def obtener_historial(email):
    try:
        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        historial = [h.to_dict() for h in user.historial]
        return jsonify({
            'success': True,
            'historial': historial,
            'total_calculos': len(historial)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# LIMPIAR HISTORIAL
# =========================
@app.route('/api/historial/<email>', methods=['DELETE'])
def limpiar_historial(email):
    try:
        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        Historial.query.filter_by(email=email).delete()
        db.session.commit()

        return jsonify({'success': True, 'message': 'Historial limpiado exitosamente'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# OBTENER TODOS LOS USUARIOS (ADMIN)
# =========================
@app.route('/api/usuarios', methods=['GET'])
def obtener_todos_usuarios():
    try:
        usuarios = User.query.all()
        return jsonify({
            'success': True,
            'usuarios': [u.to_dict() for u in usuarios],
            'total_usuarios': len(usuarios)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# OBTENER USUARIO ESPECÍFICO 
# =========================
@app.route('/api/usuarios/<email>', methods=['GET'])
def obtener_usuario_especifico(email):
    try:
        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        historial = [h.to_dict() for h in user.historial[-10:]]  # Últimos 10
        total_calculos = len(user.historial)

        return jsonify({
            'success': True,
            'usuario': {
                'nombre': user.nombre,
                'email': user.email,
                'tema_preferido': user.tema_preferido,
                'rol': user.rol,
                'historial': historial,
                'total_calculos': total_calculos
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# ACTUALIZAR USUARIO 
# =========================
@app.route('/api/usuarios/<email>', methods=['PUT'])
def actualizar_usuario(email):
    try:
        data = request.json
        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        user.nombre = data.get('nombre', user.nombre)
        user.tema_preferido = data.get('tema_preferido', user.tema_preferido)
        user.rol = data.get('rol', user.rol)
        if data.get('password'):
            user.password = data['password']

        db.session.commit()

        return jsonify({'success': True, 'message': 'Usuario actualizado exitosamente'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500

# =========================
# ESTADÍSTICAS DEL SISTEMA
# =========================
@app.route('/api/admin/estadisticas', methods=['GET'])
def obtener_estadisticas():
    try:
        total_usuarios = User.query.count()
        total_calculos = Historial.query.count()

        temas = {}
        for user in User.query.with_entities(User.tema_preferido).all():
            tema = user[0]
            temas[tema] = temas.get(tema, 0) + 1

        # Usuario más activo
        from sqlalchemy import func
        usuario_mas_activo = db.session.query(
            User.nombre, User.email, func.count(Historial.id).label('total')
        ).join(Historial, isouter=True
        ).group_by(User.email
        ).order_by(func.count(Historial.id).desc()
        ).first()

        return jsonify({
            'success': True,
            'estadisticas': {
                'total_usuarios': total_usuarios,
                'total_calculos': total_calculos,
                'promedio_calculos_por_usuario': round(total_calculos / total_usuarios, 2) if total_usuarios > 0 else 0,
                'usuarios_por_tema': temas,
                'usuario_mas_activo': {
                    'nombre': usuario_mas_activo.nombre,
                    'email': usuario_mas_activo.email,
                    'total': usuario_mas_activo.total
                } if usuario_mas_activo else None
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500

# =========================
# RUTAS BÁSICAS
# =========================
@app.route('/')
def home():
    return jsonify({
        'message': 'API de Calculadora Geométrica con Flask-SQLAlchemy (ORM)',
        'status': 'Conectado'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db.session.execute(db.text("SELECT 1"))
        return jsonify({'success': True, 'message': 'MySQL conectado correctamente'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


# =========================
# INICIAR SERVIDOR
# =========================
if __name__ == '__main__':
    print("API con Flask-SQLAlchemy (ORM) iniciada en puerto 5000")
    app.run(debug=True, port=5000)