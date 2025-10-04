document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Aplicar modo guardado
    // ============================
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado) document.body.className = modoGuardado;

    // ============================
    // 🔹 Manejo del Modo Oscuro
    // ============================
    const modoBtn = document.getElementById('modoBtn');
    if (modoBtn) {
        modoBtn.addEventListener('click', () => {
            if (document.body.classList.contains('light-mode')) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('modo', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('modo', 'light-mode');
            }
        });
    }

    // ============================
    // 🔹 Botones Para Volver
    // ============================
    const volverBtn = document.getElementById('volverBtn');
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
    const volverFiguras3dBtn = document.getElementById('volverFiguras3d');
    if (volverFiguras3dBtn) {
        volverFiguras3dBtn.addEventListener('click', () => {
            window.location.href = 'figuras3d.html';
        });
    }
    const volverFiguras2dBtn = document.getElementById('volverFiguras2d');
    if (volverFiguras2dBtn) {
        volverFiguras2dBtn.addEventListener('click', () => {
            window.location.href = 'figuras2d.html';
        });
    }

    // ============================
    // 🔹 Login
    // ============================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const res = await fetch('http://127.0.0.1:5000/perfiles');
                const perfiles = await res.json();

                const usuarioEncontrado = Object.entries(perfiles).find(
                    ([id, u]) => u.email === email && u.password === password
                );

                if (usuarioEncontrado) {
                    const [id, usuario] = usuarioEncontrado;
                    localStorage.setItem('usuarioActual', JSON.stringify({id, ...usuario}));
                    alert('Se inició sesión correctamente');
                    window.location.href = '../index.html';
                } else {
                    alert('Hubo un error en el inicio de sesión');
                }
            } catch (err) {
                console.error(err);
                alert('Error de conexión con el servidor');
            }
        });
    }

    // ============================
    // 🔹 Registro de usuario
    // ============================
    const registroForm = document.getElementById('registroForm');

    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const usuarioId = email.split('@')[0]; // generar id simple basado en email

            try {
                const res = await fetch('http://127.0.0.1:5000/perfiles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario: usuarioId, nombre, email, password })
                });

                const data = await res.json();

                if (res.status === 200) {
                    // Guardar usuario recién creado en localStorage para persistencia
                    localStorage.setItem('usuarioActual', JSON.stringify({id: usuarioId, nombre, email, password, historial: []}));
                    alert('Usuario registrado correctamente');
                    window.location.href = '../index.html';
                } else {
                    alert(`Error: ${data.msg}`);
                }

            } catch (err) {
                console.error(err);
                alert('Error de conexión con el servidor');
            }
        });
    }
    
    // ============================
    // 🔹 Cerrar Sesión (index.html)
    // ============================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
            if (usuarioActual) {
                localStorage.removeItem('usuarioActual');
                alert('Se cerró sesión');
                window.location.reload();
            } else {
                alert('No hay usuario logeado');
            }
        });
    }

    // ============================
    // 🔹 Eliminar Usuario (index.html)
    // ============================
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
            if (!usuarioActual) {
                alert('No hay usuario logeado');
                return;
            }

            const confirmacion = confirm('¿Deseas eliminar tu cuenta?');
            if (!confirmacion) return;

            try {
                const res = await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
                    method: 'DELETE'
                });

                const data = await res.json();
                alert(data.msg);

                localStorage.removeItem('usuarioActual');
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert('Error de conexión con el servidor');
            }
        });
    }

    // ============================
    // 🔹 Control de botones según sesión (index.html)
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuarioActual) {
        // Si hay usuario logeado, mostrar cerrar y eliminar, ocultar iniciar/registrar
        document.getElementById('loginBtn')?.classList.add('oculto');
        document.getElementById('registroBtn')?.classList.add('oculto');
        logoutBtn?.classList.remove('oculto');
        deleteBtn?.classList.remove('oculto');
    } else {
        // Si no hay usuario, mostrar iniciar/registrar, ocultar cerrar/eliminar
        document.getElementById('loginBtn')?.classList.remove('oculto');
        document.getElementById('registroBtn')?.classList.remove('oculto');
        logoutBtn?.classList.add('oculto');
        deleteBtn?.classList.add('oculto');
    }
});

    // ============================
    // 🔹 Utilidades de forma general
    // ============================

    // ============================
    // 🔹 Función general de validación numérica
    // ============================
    function validarNumero(valor) {
        const patron = /^(\d+(\.\d+)?)$/;
        if (!patron.test(valor)) {
            return false;
        }
        const num = parseFloat(valor);
        return num > 0;
    }

    // ============================
    // 🔹 Función para registrar historial global
    // ============================
    function guardarHistorialGlobal(seccion, calculo) {
        const fechaHora = new Date().toLocaleString(); // Fecha y hora local

        // Cargar historial existente del localStorage (o crear uno nuevo)
        const historial = JSON.parse(localStorage.getItem("historialCalculos")) || [];

        // Crear el nuevo registro
        const nuevoRegistro = {
            seccion: seccion,   // Ejemplo: "Figuras 3D"
            calculo: calculo,   // Ejemplo: "Cilindro"
            fechaHora: fechaHora
        };

        // Agregarlo al historial
        historial.push(nuevoRegistro);

        // Guardarlo nuevamente
        localStorage.setItem("historialCalculos", JSON.stringify(historial));
    }
