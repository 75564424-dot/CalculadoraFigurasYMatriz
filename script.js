// ============================================================
// 🧠 SCRIPT GENERAL - Calculadora Geométrica
// ------------------------------------------------------------
// Contiene lógica compartida para todas las páginas:
// - Control de modo oscuro
// - Manejo de sesión (login, logout, registro)
// - Navegación entre páginas
// - Gestión de historial
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🌗 Aplicar Modo Guardado
    // ----------------------------
    // Recupera el modo desde localStorage y lo aplica al cargar la página
    const modoGuardado = localStorage.getItem('modo') || 'light-mode';
    document.body.className = modoGuardado;

    // ============================
    // 🌙 Botón de Modo Oscuro
    // ----------------------------
    // Alterna entre modo claro y oscuro y guarda la selección
    const modoBtn = document.getElementById('modoBtn');
    modoBtn?.addEventListener('click', () => {
        const nuevoModo = document.body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
        document.body.className = nuevoModo;
        localStorage.setItem('modo', nuevoModo);

        // Actualizar modo en perfil si hay usuario logeado
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual) {
            usuarioActual.modo = nuevoModo;
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

            fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modo: nuevoModo })
            }).catch(err => console.error('Error al guardar modo en API:', err));
        }
    });

    // ============================
    // 🔙 Botones de Retorno
    // ----------------------------
    // Navegación a páginas relacionadas
    const botonesVolver = {
        volverBtn: '../index.html',
        volverFiguras3d: 'figuras3d.html',
        volverFiguras2d: 'figuras2d.html'
    };
    Object.entries(botonesVolver).forEach(([id, destino]) => {
        const boton = document.getElementById(id);
        boton?.addEventListener('click', () => window.location.href = destino);
    });

    // ============================
    // 🔐 Inicio de Sesión
    // ----------------------------
    // Recibe datos del form login y valida con la API Flask
    // Envía: email, password
    // Recibe: datos del usuario (nombre, rol, modo, historial)
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', manejarLogin);

    // ============================
    // 🧾 Registro de usuario
    // ----------------------------
    // Recibe datos del form registro y crea un nuevo perfil
    // Envía: nombre, email, password, rol, modo preferido
    // Recibe: confirmación del servidor
    const registroForm = document.getElementById('registroForm');
    registroForm?.addEventListener('submit', manejarRegistro);

    // ============================
    // 🚪 Cerrar Sesión
    // ----------------------------
    // Guarda modo actual en perfil y elimina sesión
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', async () => {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        const modoActual = document.body.className;

        if (usuarioActual) {
            usuarioActual.modo = modoActual;
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

            // Guardar en API
            try {
                await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ modo: modoActual })
                });
            } catch (err) {
                console.error('Error al guardar modo en API:', err);
            }
        }

        localStorage.removeItem('usuarioActual');
        alert('Se cerró sesión');
        window.location.reload();
    });

    // ============================
    // 🗑️ Eliminar mi Usuario
    // ----------------------------
    // Permite eliminar la cuenta del usuario actual (no admin)
    const eliminarMiUsuarioBtn = document.getElementById('eliminarMiUsuarioBtn');
    eliminarMiUsuarioBtn?.addEventListener('click', eliminarMiUsuario);

    // ============================
    // 🧩 Control de Sesión
    // ----------------------------
    // Muestra/oculta botones según si hay sesión activa
    actualizarVisibilidadBotones();
});

// ============================================================
// ⚙️ FUNCIONES DE UTILIDAD
// ============================================================

/**
 * 🧑‍💻 Maneja el proceso de login de usuario
 * @param {Event} e - Evento submit
 * - Recibe: email, password
 * - Envía: GET a /perfiles para validar
 * - Actualiza localStorage con usuarioActual y modo
 */
async function manejarLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const res = await fetch('http://127.0.0.1:5000/perfiles');
        const perfiles = await res.json();

        const usuarioEncontrado = Object.entries(perfiles).find(
            ([, u]) => u.email === email && u.password === password
        );

        if (usuarioEncontrado) {
            const [id, usuario] = usuarioEncontrado;

            // Aplicar modo preferido del usuario
            const modoUsuario = usuario.modo || 'light-mode';
            document.body.className = modoUsuario;
            localStorage.setItem('modo', modoUsuario);

            // Guardar usuario actual
            localStorage.setItem('usuarioActual', JSON.stringify({ id, ...usuario }));

            alert('Se inició sesión correctamente');
            window.location.href = '../index.html';
        } else {
            alert('Correo o contraseña incorrectos');
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
    }
}

/**
 * 📝 Maneja el registro de nuevos usuarios
 * @param {Event} e - Evento submit
 * - Recibe: nombre, email, password, confirmPassword, modoPreferido
 * - Envía: POST a /perfiles con datos de registro
 * - Actualiza localStorage con usuarioActual y aplica modo
 */
async function manejarRegistro(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const modoPreferido = document.getElementById('modoPreferido').value;
    const usuarioId = email.split('@')[0];

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const res = await fetch('http://127.0.0.1:5000/perfiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: usuarioId,
                nombre,
                email,
                password,
                rol: "usuario",
                modo: modoPreferido
            })
        });

        const data = await res.json();
        if (res.ok) {
            const usuarioActual = {
                id: usuarioId,
                nombre,
                email,
                password,
                rol: "usuario",
                modo: modoPreferido,
                historial: []
            };
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

            document.body.className = modoPreferido;
            localStorage.setItem('modo', modoPreferido);

            alert('Usuario registrado correctamente');
            window.location.href = '../index.html';
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
    }
}

/**
 * 🗑️ Elimina la cuenta del usuario actual
 * - Envía: DELETE a /perfiles/:id
 */
async function eliminarMiUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) return alert('No hay usuario logeado');
    if (usuarioActual.rol === "admin") return alert('El administrador no puede eliminar su cuenta desde aquí.');

    if (!confirm('¿Deseas eliminar tu cuenta?')) return;
    try {
        const res = await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.msg);
        localStorage.removeItem('usuarioActual');
        window.location.reload();
    } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor');
    }
}

/**
 * 👁️ Actualiza visibilidad de botones y tarjeta de bienvenida
 * - No recibe parámetros, lee localStorage usuarioActual
 * - Muestra/oculta botones según rol
 */
function actualizarVisibilidadBotones() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const esIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    const elementos = {
        bienvenidaTarjeta: document.getElementById('bienvenidaTarjeta'),
        bienvenidaMensaje: document.getElementById('bienvenidaMensaje'),
        bienvenidaRol: document.getElementById('bienvenidaRol'),
        loginBtn: document.getElementById('loginBtn'),
        registroBtn: document.getElementById('registroBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        eliminarUsuariosBtn: document.getElementById('eliminarUsuariosBtn'),
        eliminarMiUsuarioBtn: document.getElementById('eliminarMiUsuarioBtn')
    };

    if (usuarioActual) {
        const rol = usuarioActual.rol || "usuario";
        elementos.loginBtn?.classList.add('oculto');
        elementos.registroBtn?.classList.add('oculto');
        elementos.logoutBtn?.classList.remove('oculto');

        if (rol === "admin") {
            elementos.eliminarMiUsuarioBtn?.classList.add('oculto');
            elementos.eliminarUsuariosBtn?.classList.remove('oculto');
        } else {
            elementos.eliminarMiUsuarioBtn?.classList.remove('oculto');
            elementos.eliminarUsuariosBtn?.classList.add('oculto');
        }

        if (esIndex && elementos.bienvenidaTarjeta) {
            elementos.bienvenidaMensaje.textContent = `¡Bienvenido, ${usuarioActual.nombre}! 👋`;
            elementos.bienvenidaRol.textContent = rol === "admin" ? "Rol: Administrador 🛠️" : "Rol: Usuario 👤";
            elementos.bienvenidaTarjeta.classList.remove('oculto');
        }
    } else {
        Object.values(elementos).forEach(el => el?.classList.add('oculto'));
        elementos.loginBtn?.classList.remove('oculto');
        elementos.registroBtn?.classList.remove('oculto');
    }
}

/**
 * ✅ Valida si un número es positivo y decimal
 */
function validarNumero(valor) {
    const patron = /^(\d+(\.\d+)?)$/;
    if (!patron.test(valor)) return false;
    const num = parseFloat(valor);
    return num > 0;
}

/**
 * 💾 Guarda cálculos en el historial local general
 */
function guardarHistorialGlobal(seccion, calculo) {
    const fechaHora = new Date().toLocaleString();
    const historial = JSON.parse(localStorage.getItem("historialCalculos")) || [];
    historial.push({ seccion, calculo, fechaHora });
    localStorage.setItem("historialCalculos", JSON.stringify(historial));
}

/**
 * ☁️ Envía historial a la API y lo guarda localmente por usuario
 */
async function enviarHistorialAPI(calculo) {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) return;

    let seccion = '';
    const ruta = window.location.pathname.toLowerCase();
    if (ruta.includes('figuras3d')) seccion = 'Figuras 3D';
    else if (ruta.includes('figuras2d')) seccion = 'Figuras 2D';
    else if (ruta.includes('matrices')) seccion = 'Matrices 4x4';
    else seccion = 'Inicio';

    const fechaHora = new Date().toLocaleString();
    const nuevaEntrada = { seccion, calculo, fechaHora };

    usuarioActual.historial = usuarioActual.historial || [];
    usuarioActual.historial.push(nuevaEntrada);
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

    try {
        await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ historial: usuarioActual.historial })
        });
    } catch (err) {
        console.error('Error al actualizar historial en API:', err);
    }
}

// ============================================================
// ⚙️ Redirección al CRUD (solo para admin)
const eliminarUsuariosBtn = document.getElementById('eliminarUsuariosBtn');
if (eliminarUsuariosBtn) {
    eliminarUsuariosBtn.addEventListener('click', () => {
        window.location.href = 'autenticacion/CRUD.html';
    });
}