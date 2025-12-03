from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde frontend local

# =========================================
# Almacenamiento temporal con roles
# =========================================
perfiles = {
    "admin": {
        "nombre": "Administrador",
        "email": "admin@gmail.com",
        "password": "123",
        "rol": "admin",
        "historial": [],
        "modo": "dark-mode"
    },
    "brayan": {
        "nombre": "Brayan",
        "email": "75564424@continental.edu.pe",
        "password": "1234",
        "rol": "usuario",
        "historial": [],
        "modo": "light-mode"
    }
}

# =========================
# Crear perfil
# =========================
@app.route('/perfiles', methods=['POST'])
def crear_perfil():
    data = request.json
    usuario_id = data.get('usuario')

    if usuario_id in perfiles:
        return jsonify({'msg': 'Usuario ya existe', 'usuario': usuario_id}), 400

    nuevo_rol = data.get('rol', 'usuario')  # Por defecto usuario
    modo = data.get('modo', 'light-mode')   # 🌗 Nuevo campo

    perfiles[usuario_id] = {
        'nombre': data.get('nombre'),
        'email': data.get('email'),
        'password': data.get('password'),
        'rol': nuevo_rol,
        'modo': modo,              # 🌗 Guardamos modo preferido
        'historial': []
    }
    return jsonify({'msg': 'Perfil creado', 'usuario': usuario_id})

# =========================
# Obtener todos los perfiles
# =========================
@app.route('/perfiles', methods=['GET'])
def obtener_perfiles():
    return jsonify(perfiles)

# =========================
# Obtener perfil específico
# =========================
@app.route('/perfiles/<usuario_id>', methods=['GET'])
def obtener_perfil(usuario_id):
    perfil = perfiles.get(usuario_id)
    if perfil:
        return jsonify(perfil)
    return jsonify({'msg': 'Usuario no encontrado'}), 404

# =========================
# Actualizar perfil
# =========================
@app.route('/perfiles/<usuario_id>', methods=['PUT'])
def actualizar_perfil(usuario_id):
    data = request.json
    perfil = perfiles.get(usuario_id)
    if perfil:
        for key in ['nombre', 'email', 'password', 'historial', 'rol', 'modo']:
            if key in data:
                perfil[key] = data[key]
        return jsonify({'msg': 'Perfil actualizado', 'usuario': usuario_id})
    return jsonify({'msg': 'Usuario no encontrado'}), 404

# =========================
# Eliminar perfil
# =========================
@app.route('/perfiles/<usuario_id>', methods=['DELETE'])
def eliminar_perfil(usuario_id):
    if usuario_id in perfiles:
        del perfiles[usuario_id]
        return jsonify({'msg': 'Perfil eliminado'})
    return jsonify({'msg': 'Usuario no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)