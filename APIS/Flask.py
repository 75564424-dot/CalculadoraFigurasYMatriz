#pip install Flask Flask-CORS Flask-SQLAlchemy PyMySQL
from flask import Flask, jsonify
from flask_cors import CORS
from BD import init_db
from servicios import (
    registrar_usuario, login_usuario, guardar_historial,
    obtener_historial, obtener_usuario_por_email, actualizar_usuario
)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/calculadora_geometrica'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

# Rutas existentes
@app.route('/api/registro', methods=['POST'])
def registro():
    return registrar_usuario()

@app.route('/api/login', methods=['POST'])
def login():
    return login_usuario()

@app.route('/api/historial', methods=['POST'])
def historial():
    return guardar_historial()

@app.route('/api/historial/<email>', methods=['GET'])
def historial_usuario(email):
    return obtener_historial(email)

@app.route('/api/usuarios/<email>', methods=['GET'])
def obtener_usuario(email):
    return obtener_usuario_por_email(email)

@app.route('/api/usuarios/<email>', methods=['PUT'])
def actualizar(email):
    return actualizar_usuario(email)

@app.route('/api/eliminar-cuenta', methods=['DELETE'])
def eliminar_cuenta():
    from servicios import eliminar_usuario
    return eliminar_usuario()

@app.route('/api/usuarios', methods=['GET'])
def obtener_todos_los_usuarios():
    from servicios import obtener_todos_los_usuarios_servicio
    return obtener_todos_los_usuarios_servicio()

@app.route('/api/cambiar-nombre', methods=['PUT'])
def cambiar_nombre():
    from servicios import cambiar_nombre_usuario
    return cambiar_nombre_usuario()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
