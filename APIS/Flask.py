from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite peticiones desde frontend local

# =========================================
# Almacenamiento temporal en memoria con usuarios iniciales
# =========================================
perfiles = {
    "admin": {
        "nombre": "admin",
        "email": "admin@gmail.com",
        "password": "123",  # ⚠️ En producción, siempre usar hash
        "historial": []
    },
    "brayan": {
        "nombre": "brayan",
        "email": "75564424@continental.edu.pe",
        "password": "1234",
        "historial": []
    }
}

# =========================
# Crear perfil
# POST /perfiles
# =========================
@app.route('/perfiles', methods=['POST'])
def crear_perfil():
    data = request.json
    usuario_id = data.get('usuario')
    if usuario_id in perfiles:
        return jsonify({'msg': 'Usuario ya existe', 'usuario': usuario_id}), 400
    perfiles[usuario_id] = {
        'nombre': data.get('nombre'),
        'email': data.get('email'),
        'password': data.get('password'),
        'historial': []
    }
    return jsonify({'msg': 'Perfil creado', 'usuario': usuario_id})

# =========================
# Obtener todos los perfiles
# GET /perfiles
# =========================
@app.route('/perfiles', methods=['GET'])
def obtener_perfiles():
    return jsonify(perfiles)

# =========================
# Obtener perfil específico
# GET /perfiles/<usuario_id>
# =========================
@app.route('/perfiles/<usuario_id>', methods=['GET'])
def obtener_perfil(usuario_id):
    perfil = perfiles.get(usuario_id)
    if perfil:
        return jsonify(perfil)
    return jsonify({'msg': 'Usuario no encontrado'}), 404

# =========================
# Actualizar perfil (historial u otros datos)
# PUT /perfiles/<usuario_id>
# =========================
@app.route('/perfiles/<usuario_id>', methods=['PUT'])
def actualizar_perfil(usuario_id):
    data = request.json
    perfil = perfiles.get(usuario_id)
    if perfil:
        # ⚡ Solo actualizamos los campos que lleguen en el JSON
        for key in ['nombre', 'email', 'password', 'historial']:
            if key in data:
                perfil[key] = data[key]
        return jsonify({'msg': 'Perfil actualizado', 'usuario': usuario_id})
    return jsonify({'msg': 'Usuario no encontrado'}), 404

# =========================
# Eliminar perfil
# DELETE /perfiles/<usuario_id>
# =========================
@app.route('/perfiles/<usuario_id>', methods=['DELETE'])
def eliminar_perfil(usuario_id):
    if usuario_id in perfiles:
        del perfiles[usuario_id]
        return jsonify({'msg':'Perfil eliminado'})
    return jsonify({'msg':'Usuario no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)