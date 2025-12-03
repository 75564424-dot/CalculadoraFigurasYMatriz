// ============================================================
// 🧩 CRUD Dinámico con Formularios Modales — DOCUMENTADO
// ------------------------------------------------------------
// Este archivo gestiona la interfaz dinámica del CRUD de usuarios.
// Cada acción (crear, leer, actualizar, eliminar) se comunica
// con una API REST mediante peticiones HTTP (fetch).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔒 Validación de acceso admin
    // ----------------------------
    // Se mantiene la persistencia del usuario mediante localStorage.
    // Recupera el usuario almacenado en localStorage y verifica su rol.
    // Si no es "admin", bloquea el acceso y redirige al menú principal.
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
        alert('❌ Acceso denegado. Solo los administradores pueden entrar aquí.');
        window.location.href = '../index.html';
        return;
    }

    // ============================
    // 🧩 Referencias a elementos del DOM
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta'); // tarjetas CRUD
    const overlay = document.getElementById('overlayFormulario'); // fondo modal
    const tarjetaFormulario = document.getElementById('tarjetaFormulario'); // tarjeta modal

    // ============================================================
    // 📡 FUNCIÓN GENERAL: Enviar datos a la API
    // ------------------------------------------------------------
    /**
     * Envía una solicitud HTTP genérica (GET, POST, PUT, DELETE) a la API.
     * @param {string} url - Endpoint completo de la API.
     * @param {string} metodo - Método HTTP (GET, POST, PUT, DELETE).
     * @param {Object|null} datos - Objeto con los datos a enviar (opcional).
     * @returns {Promise<Object>} - Respuesta de la API en formato JSON.
     */
    async function enviarDatos(url, metodo = 'GET', datos = null) {
        const opciones = { method: metodo, headers: { 'Content-Type': 'application/json' } };
        if (datos) opciones.body = JSON.stringify(datos);

        const res = await fetch(url, opciones);
        if (!res.ok) throw new Error(`Error ${metodo}: ${res.statusText}`);
        return res.json();
    }

    // ============================================================
    // 🧩 Acciones CRUD por tarjeta
    // ------------------------------------------------------------
    // Cada tarjeta contiene un atributo data-accion (crear, leer, actualizar, eliminar).
    // Según el valor, ejecuta la función correspondiente.
    // ============================================================
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', async () => {
            const accion = tarjeta.dataset.accion;
            console.log(`🟢 Clic detectado en tarjeta: ${accion}`); // depuración
            overlay.style.display = 'flex'; // muestra modal

            try {
                switch (accion) {
                    case 'crear': mostrarFormularioCrear(); break;
                    case 'leer': await mostrarListaUsuarios(); break;
                    case 'actualizar': mostrarFormularioActualizar(); break;
                    case 'eliminar': mostrarFormularioEliminar(); break;
                    default: console.warn('⚠️ Acción no reconocida:', accion);
                }
            } catch (error) {
                console.error(`❌ Error en la acción "${accion}":`, error);
                alert(`Error ejecutando ${accion}: ${error.message}`);
                ocultarFormulario();
            }
        });
    });

    // ============================================================
    // 🔹 CREAR USUARIO
    // ------------------------------------------------------------
    /**
     * Muestra un formulario para registrar un nuevo usuario.
     * Envía los datos con POST al endpoint de la API.
     * Datos enviados: { nombre, email, password, modoPreferido }
     * Endpoint: POST /perfiles
     */
    function mostrarFormularioCrear() {
        tarjetaFormulario.innerHTML = `
            <h2>🧾 Crear nuevo usuario</h2>
            <form id="formCrearUsuario">
                <input type="text" id="nombre" placeholder="Nombre completo" required>
                <input type="email" id="email" placeholder="Correo electrónico" required>
                <input type="password" id="password" placeholder="Contraseña" required>
                <input type="password" id="confirmPassword" placeholder="Confirmar contraseña" required>
                <select id="modoPreferido">
                    <option value="light-mode">🌞 Modo Claro</option>
                    <option value="dark-mode">🌙 Modo Oscuro</option>
                </select>
                <button type="submit">Registrar Usuario</button>
                <button type="button" class="btn-cancelar" id="cancelarBtn">No de momento</button>
            </form>
        `;
        document.getElementById('formCrearUsuario').addEventListener('submit', manejarRegistro);
        document.getElementById('cancelarBtn').addEventListener('click', ocultarFormulario);
    }

    // ============================================================
    // 📖 LEER USUARIOS
    // ------------------------------------------------------------
    /**
     * Obtiene y muestra la lista de usuarios registrados.
     * Endpoint: GET /perfiles
     */
    async function mostrarListaUsuarios() {
        tarjetaFormulario.innerHTML = `<h2>👥 Lista de usuarios</h2><p>Cargando...</p>`;
        try {
            const data = await enviarDatos('http://127.0.0.1:5000/perfiles');
            let html = `
                <table class="tabla-crud">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead><tbody>
            `;
            Object.entries(data).forEach(([id, user]) => {
                html += `<tr><td>${id}</td><td>${user.nombre}</td><td>${user.email}</td><td>${user.rol}</td></tr>`;
            });
            html += `</tbody></table><button type="button" class="btn-cancelar" id="cancelarBtn">No de momento</button>`;
            tarjetaFormulario.innerHTML = html;
            document.getElementById('cancelarBtn').addEventListener('click', ocultarFormulario);
        } catch (error) {
            tarjetaFormulario.innerHTML = `<p>❌ Error al cargar usuarios (${error.message}).</p>
                                           <button type="button" class="btn-cancelar" id="cancelarBtn">Cerrar</button>`;
            document.getElementById('cancelarBtn').addEventListener('click', ocultarFormulario);
        }
    }

    // ============================================================
    // ✏️ ACTUALIZAR USUARIO
    // ------------------------------------------------------------
    /**
     * Muestra un selector con los usuarios existentes.
     * Los campos se autocompletan para evitar errores del admin.
     * Endpoint: PUT /perfiles/:id
     */
    async function mostrarFormularioActualizar() {
        try {
            const usuarios = await enviarDatos('http://127.0.0.1:5000/perfiles');

            let opcionesUsuarios = `<option value="">-- Selecciona --</option>`;
            Object.entries(usuarios).forEach(([id, u]) => {
                opcionesUsuarios += `<option value="${id}">${u.nombre}</option>`;
            });

            tarjetaFormulario.innerHTML = `
                <h2>✏️ Actualizar usuario</h2>
                <form id="formActualizar">
                    <label>Selecciona un usuario:</label>
                    <select id="usuarioId" required>${opcionesUsuarios}</select>
                    <div id="camposUsuario"></div>
                    <button type="submit">Actualizar</button>
                    <button type="button" class="btn-cancelar" id="cancelarBtn">No de momento</button>
                </form>
            `;

            document.getElementById('cancelarBtn').addEventListener('click', ocultarFormulario);
            const selectUsuario = document.getElementById('usuarioId');
            const camposUsuario = document.getElementById('camposUsuario');

            // Autocompletar campos al seleccionar un usuario
            selectUsuario.addEventListener('change', () => {
                const id = selectUsuario.value;
                if (!id) return (camposUsuario.innerHTML = '');
                const usuario = usuarios[id];
                camposUsuario.innerHTML = `
                    <input type="text" id="nombreNuevo" value="${usuario.nombre}" required>
                    <input type="email" id="emailNuevo" value="${usuario.email}" required>
                    <input type="password" id="passwordNuevo" value="${usuario.password}" required>
                    <select id="rolNuevo">
                        <option value="usuario" ${usuario.rol === 'usuario' ? 'selected' : ''}>Usuario</option>
                        <option value="admin" ${usuario.rol === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                `;
            });

            document.getElementById('formActualizar').addEventListener('submit', actualizarUsuario);

        } catch (error) {
            alert(`❌ Error al cargar usuarios para actualización: ${error.message}`);
        }
    }

    // ============================================================
    // ❌ ELIMINAR USUARIO
    // ------------------------------------------------------------
    /**
     * Permite al administrador eliminar un usuario existente.
     * Endpoint: DELETE /perfiles/:id
     */
    async function mostrarFormularioEliminar() {
        try {
            const usuarios = await enviarDatos('http://127.0.0.1:5000/perfiles');
            let opcionesUsuarios = `<option value="">-- Selecciona --</option>`;
            Object.entries(usuarios).forEach(([id, u]) => {
                opcionesUsuarios += `<option value="${id}">${u.nombre}</option>`;
            });

            tarjetaFormulario.innerHTML = `
                <h2>🗑️ Eliminar usuario</h2>
                <form id="formEliminar">
                    <select id="usuarioEliminar" required>${opcionesUsuarios}</select>
                    <button type="submit" class="btn-peligro">Eliminar</button>
                    <button type="button" class="btn-cancelar" id="cancelarBtn">No de momento</button>
                </form>
            `;
            document.getElementById('cancelarBtn').addEventListener('click', ocultarFormulario);
            document.getElementById('formEliminar').addEventListener('submit', eliminarUsuario);

        } catch (error) {
            alert(`❌ Error al cargar usuarios para eliminación: ${error.message}`);
        }
    }

    // ============================================================
    // 🔧 FUNCIONES CRUD ESPECÍFICAS
    // ============================================================

    async function actualizarUsuario(e) {
        e.preventDefault();
        try {
            const id = document.getElementById('usuarioId').value;
            const body = {};
            ['nombreNuevo', 'emailNuevo', 'passwordNuevo', 'rolNuevo'].forEach(idCampo => {
                const valor = document.getElementById(idCampo).value.trim();
                if (valor) body[idCampo.replace('Nuevo', '')] = valor;
            });
            const res = await fetch(`http://127.0.0.1:5000/perfiles/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const data = await res.json();
            alert(data.msg || '✅ Usuario actualizado.');
            ocultarFormulario();
        } catch (error) {
            alert(`❌ Error al actualizar: ${error.message}`);
        }
    }

    async function eliminarUsuario(e) {
        e.preventDefault();
        try {
            const id = document.getElementById('usuarioEliminar').value.trim();
            if (!confirm(`¿Eliminar al usuario "${id}"?`)) return;
            const res = await fetch(`http://127.0.0.1:5000/perfiles/${id}`, { method: 'DELETE' });
            const data = await res.json();
            alert(data.msg || '✅ Usuario eliminado.');
            ocultarFormulario();
        } catch (error) {
            alert(`❌ Error al eliminar: ${error.message}`);
        }
    }

    // ============================================================
    // ❌ OCULTAR MODAL
    // ------------------------------------------------------------
    /**
     * Oculta el overlay y limpia el contenido de la tarjeta modal.
     */
    function ocultarFormulario() {
        overlay.style.display = 'none';
        tarjetaFormulario.innerHTML = '';
    }

});