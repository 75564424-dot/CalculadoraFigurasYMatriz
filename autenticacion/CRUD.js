// Variables globales
let usuariosData = [];

// ======================================================
// FUNCIÓN PARA MOSTRAR MENSAJES EN LA NUBE
// ======================================================
function mostrarMensaje(mensaje, tipo = 'info') {
    // Intentar enviar mensaje a la nube del sistema (menu-principal)
    if (window.parent && typeof window.parent.mostrarMensaje === 'function') {
        window.parent.mostrarMensaje(mensaje, tipo);
    } else if (window.parent && typeof window.parent.agregarMensajeANube === 'function') {
        // Fallback: usar la función alternativa si existe
        window.parent.agregarMensajeANube(mensaje, tipo);
    } else {
        // Fallback final: mostrar en consola
        console.log(`Mensaje (${tipo}): ${mensaje}`);
    }
}

// ======================================================
// INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', function() {
    verificarPermisosAdmin();
    cargarEstadisticas();

    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.tarjeta-crud').forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            const accion = this.getAttribute('data-accion');
            ejecutarAccionCRUD(accion);
        });
    });

    // Mostrar mensaje de inicio
    setTimeout(() => {
        mostrarMensaje('Panel de administración cargado', 'info');
    }, 500);
});

// ======================================================
// VERIFICACIÓN DE PERMISOS (USANDO ROL)
// ======================================================
function verificarPermisosAdmin() {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    const mensajePermisos = document.getElementById('mensaje-permisos');
    const tarjetasCrud = document.querySelector('.tarjetas-crud');
    
    if (!usuarioGuardado) {
        mensajePermisos.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Debes iniciar sesión';
        mensajePermisos.style.display = 'block';
        tarjetasCrud.style.display = 'none';
        return false;
    }

    const usuario = JSON.parse(usuarioGuardado);
    
    if (usuario.rol !== 'admin') {
        mensajePermisos.innerHTML = '<i class="fas fa-ban"></i> No tienes permisos de administrador';
        mensajePermisos.style.display = 'block';
        tarjetasCrud.style.display = 'none';
        return false;
    }

    aplicarTema(usuario.tema_preferido);
    mostrarMensaje(`Bienvenido, ${usuario.nombre}`, 'success');
    return true;
}

// ======================================================
// FUNCIÓN PARA APLICAR TEMA
// ======================================================
function aplicarTema(tema) {
    const body = document.body;
    if (tema === 'oscuro') {
        body.classList.add('modo-oscuro');
    } else {
        body.classList.remove('modo-oscuro');
    }
}

// ======================================================
// FUNCIONES CRUD PRINCIPALES
// ======================================================
function ejecutarAccionCRUD(accion) {
    switch(accion) {
        case 'crear':
            mostrarFormularioCrear();
            break;
        case 'leer':
            mostrarListaUsuarios();
            break;
        case 'actualizar':
            mostrarFormularioActualizar();
            break;
        case 'eliminar':
            mostrarFormularioEliminar();
            break;
    }
}

// ======================================================
// CREAR USUARIO
// ======================================================
function mostrarFormularioCrear() {
    const formulario = `
        <h2><i class="fas fa-user-plus"></i> Crear Nuevo Usuario</h2>
        <div class="grupo-entrada">
            <label for="nombre"><i class="fas fa-user"></i> Nombre Completo</label>
            <input type="text" id="nombre" placeholder="Ingresa el nombre completo">
        </div>
        <div class="grupo-entrada">
            <label for="email"><i class="fas fa-envelope"></i> Email</label>
            <input type="email" id="email" placeholder="Ingresa el email">
        </div>
        <div class="grupo-entrada">
            <label for="password"><i class="fas fa-lock"></i> Contraseña</label>
            <input type="password" id="password" placeholder="Ingresa la contraseña">
        </div>
        <div class="grupo-entrada">
            <label><i class="fas fa-palette"></i> Tema Preferido</label>
            <div style="display: flex; gap: 15px; margin-top: 10px;">
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="radio" name="tema" value="claro" checked> Modo Claro
                </label>
                <label style="display: flex; align-items: center; gap: 5px;">
                    <input type="radio" name="tema" value="oscuro"> Modo Oscuro
                </label>
            </div>
        </div>
        <div class="grupo-entrada">
            <label for="rol"><i class="fas fa-user-shield"></i> Rol</label>
            <select id="rol" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--light-gray);">
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        <div class="grupo-botones">
            <button class="boton boton-primario" onclick="crearUsuario()">
                <i class="fas fa-save"></i> Guardar Usuario
            </button>
            <button class="boton boton-regresar" onclick="cerrarFormulario()">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    document.getElementById('tarjetaFormulario').innerHTML = formulario;
    document.getElementById('overlayFormulario').classList.add('visible');
}

async function crearUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tema = document.querySelector('input[name="tema"]:checked').value;
    const rol = document.getElementById('rol').value;

    if (!nombre || !email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        // Mostrar mensaje de carga
        mostrarMensaje('Creando usuario...', 'info');

        const response = await fetch('http://localhost:5000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                tema_preferido: tema,
                rol: rol,
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Usuario creado exitosamente', 'success');
            cerrarFormulario();
            cargarEstadisticas();
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// ======================================================
// VER USUARIOS
// ======================================================
async function mostrarListaUsuarios() {
    try {
        mostrarMensaje('Cargando lista de usuarios...', 'info');

        const response = await fetch('http://localhost:5000/api/usuarios');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Error del servidor');
        }

        const usuarios = data.usuarios;  // ARRAY, no objeto

        let listaHTML = `
            <h2>Lista de Usuarios</h2>
            <div style="max-height: 400px; overflow-y: auto; margin: 1rem 0;">
                <table class="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Tema</th>
                            <th>Rol</th>
                            <th>Cálculos</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // CORRECTO: .forEach en ARRAY
        usuarios.forEach(usuario => {
            listaHTML += `
                <tr>
                    <td>${usuario.nombre || '—'}</td>
                    <td>${usuario.email || '—'}</td>
                    <td>${usuario.tema_preferido || 'claro'}</td>
                    <td><strong>${usuario.rol || 'usuario'}</strong></td>
                    <td>${usuario.historial ? usuario.historial.length : 0}</td>
                </tr>
            `;
        });

        listaHTML += `
                    </tbody>
                </table>
            </div>
            <div class="grupo-botones">
                <button class="boton boton-regresar" onclick="cerrarFormulario()">
                    Cerrar
                </button>
            </div>
        `;

        document.getElementById('tarjetaFormulario').innerHTML = listaHTML;
        document.getElementById('overlayFormulario').classList.add('visible');
        
        mostrarMensaje(`Cargados: ${usuarios.length} usuarios`, 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error: ' + error.message, 'error');
    }
}

// ======================================================
// ACTUALIZAR USUARIO
// ======================================================
function mostrarFormularioActualizar() {
    const formulario = `
        <h2><i class="fas fa-edit"></i> Actualizar Usuario</h2>
        <div class="grupo-entrada">
            <label for="emailBuscar"><i class="fas fa-search"></i> Buscar Usuario por Email</label>
            <input type="email" id="emailBuscar" placeholder="Ingresa el email del usuario">
        </div>
        <div id="formularioActualizacion" style="display: none;">
            <div class="grupo-entrada">
                <label for="nombreActualizar"><i class="fas fa-user"></i> Nombre</label>
                <input type="text" id="nombreActualizar">
            </div>
            <div class="grupo-entrada">
                <label for="temaActualizar"><i class="fas fa-palette"></i> Tema Preferido</label>
                <select id="temaActualizar" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--light-gray);">
                    <option value="claro">Modo Claro</option>
                    <option value="oscuro">Modo Oscuro</option>
                </select>
            </div>
            <div class="grupo-entrada">
                <label for="rolActualizar"><i class="fas fa-user-shield"></i> Rol</label>
                <select id="rolActualizar" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--light-gray);">
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="grupo-botones">
                <button class="boton boton-primario" onclick="actualizarUsuario()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </div>
        <div class="grupo-botones">
            <button class="boton boton-primario" onclick="buscarUsuario()">
                <i class="fas fa-search"></i> Buscar
            </button>
            <button class="boton boton-regresar" onclick="cerrarFormulario()">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    document.getElementById('tarjetaFormulario').innerHTML = formulario;
    document.getElementById('overlayFormulario').classList.add('visible');
}

async function buscarUsuario() {
    const email = document.getElementById('emailBuscar').value;

    try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${email}`);
        const data = await response.json();

        if (data.success) {
            const usuario = data.usuario;
            document.getElementById('nombreActualizar').value = usuario.nombre;
            document.getElementById('temaActualizar').value = usuario.tema_preferido;
            document.getElementById('rolActualizar').value = usuario.rol;
            document.getElementById('formularioActualizacion').style.display = 'block';
            mostrarMensaje(`Usuario encontrado: ${usuario.nombre}`, 'success');
        } else {
            mostrarMensaje('Usuario no encontrado', 'error');
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

async function actualizarUsuario() {
    const email = document.getElementById('emailBuscar').value;
    const nombre = document.getElementById('nombreActualizar').value;
    const tema = document.getElementById('temaActualizar').value;
    const rol = document.getElementById('rolActualizar').value;

    if (!nombre) {
        mostrarMensaje('El nombre es obligatorio', 'error');
        return;
    }

    try {
        mostrarMensaje('Actualizando usuario...', 'info');

        const response = await fetch(`http://localhost:5000/api/usuarios/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                tema_preferido: tema,
                rol
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Usuario actualizado exitosamente', 'success');
            cerrarFormulario();
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// ======================================================
// ELIMINAR USUARIO
// ======================================================
function mostrarFormularioEliminar() {
    const formulario = `
        <h2><i class="fas fa-user-times"></i> Eliminar Usuario</h2>
        <div class="grupo-entrada">
            <label for="emailEliminar"><i class="fas fa-envelope"></i> Email del Usuario</label>
            <input type="email" id="emailEliminar" placeholder="Ingresa el email a eliminar">
        </div>
        <div style="background: rgba(225, 112, 85, 0.1); padding: 15px; border-radius: 8px; margin: 1rem 0; border-left: 4px solid var(--danger);">
            <i class="fas fa-exclamation-triangle"></i> 
            <strong>Advertencia:</strong> Esta acción no se puede deshacer. El usuario perderá todos sus datos.
        </div>
        <div class="grupo-botones">
            <button class="boton boton-peligro" onclick="confirmarEliminacion()">
                <i class="fas fa-trash"></i> Eliminar Usuario
            </button>
            <button class="boton boton-regresar" onclick="cerrarFormulario()">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </div>
    `;
    
    document.getElementById('tarjetaFormulario').innerHTML = formulario;
    document.getElementById('overlayFormulario').classList.add('visible');
}

async function confirmarEliminacion() {
    const email = document.getElementById('emailEliminar').value;

    if (!email) {
        mostrarMensaje('Por favor, ingresa un email', 'error');
        return;
    }

    if (email === 'admin@gmail.com') {
        mostrarMensaje('No se puede eliminar al administrador principal', 'error');
        return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${email}? Esta acción no se puede deshacer.`)) {
        mostrarMensaje('Eliminación cancelada', 'info');
        return;
    }

    try {
        mostrarMensaje('Eliminando usuario...', 'info');

        const response = await fetch(`http://localhost:5000/api/eliminar-cuenta`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Usuario eliminado exitosamente', 'success');
            cerrarFormulario();
            cargarEstadisticas();
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// ======================================================
// FUNCIONES AUXILIARES
// ======================================================
function cerrarFormulario() {
    document.getElementById('overlayFormulario').classList.remove('visible');
}

async function cargarEstadisticas() {
    try {
        const response = await fetch('http://localhost:5000/api/usuarios');
        const data = await response.json();

        if (data) {
            const totalUsuarios = Object.keys(data).length;
            const totalCalculos = Object.values(data).reduce((total, usuario) => {
                return total + (usuario.historial ? usuario.historial.length : 0);
            }, 0);

            document.getElementById('total-usuarios').textContent = totalUsuarios;
            document.getElementById('total-calculos').textContent = totalCalculos;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}