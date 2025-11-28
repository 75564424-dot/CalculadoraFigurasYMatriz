from flask import jsonify, request
from BD import db, User, Historial

# =========================
# REGISTRO DE USUARIO
# =========================
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
# GUARDAR EN HISTORIAL
# =========================
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
# Obtener usuario por email
# =========================
def obtener_usuario_por_email(email):
    try:
        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        return jsonify({
            'success': True,
            'usuario': user.to_dict()
        })

    except Exception as e:
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# =========================
# Actualizar usuario
# =========================
def actualizar_usuario(email):
    try:
        data = request.json
        nombre = data.get('nombre')
        tema_preferido = data.get('tema_preferido')
        rol = data.get('rol')

        user = User.query.get(email)
        if not user:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

        if nombre:
            user.nombre = nombre
        if tema_preferido:
            user.tema_preferido = tema_preferido
        if rol:
            user.rol = rol

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Usuario actualizado correctamente'
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Error interno del servidor'}), 500


# ===============================
# ELIMINAR USUARIO
# ===============================
def eliminar_usuario():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"success": False, "error": "Email requerido"}), 400

        usuario = User.query.filter_by(email=email).first()

        if not usuario:
            return jsonify({"success": False, "error": "El usuario no existe"}), 404

        db.session.delete(usuario)
        db.session.commit()

        return jsonify({"success": True, "message": "Usuario eliminado correctamente"})

    except Exception as e:
        print("Error al eliminar usuario:", e)
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500
    

# ============================================
# OBTENER TODOS LOS USUARIOS
# ============================================
def obtener_todos_los_usuarios_servicio():
    try:
        usuarios = User.query.all()

        if not usuarios:
            return jsonify({
                "success": False,
                "usuarios": []
            })

        lista_usuarios = [u.to_dict() for u in usuarios]

        return jsonify({
            "success": True,
            "usuarios": lista_usuarios
        })

    except Exception as e:
        print("Error al obtener todos los usuarios:", e)
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500