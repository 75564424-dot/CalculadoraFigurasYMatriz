from flask import Flask, jsonify
from flask_cors import CORS
from BD import init_db
from servicios import registrar_usuario, login_usuario, guardar_historial, obtener_historial

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/calculadora_geometrica'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar base de datos
init_db(app)

# Rutas de la API
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)