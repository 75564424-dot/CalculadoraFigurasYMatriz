// ======================================================
// VERIFICACIÓN DE ADMINISTRADOR (USANDO ROL DEL BACKEND)
// ======================================================

function esAdministrador(usuario) {
    return usuario && usuario.rol === 'admin';
}

function mostrarBotonAdministracion() {
    const botonAdmin = document.getElementById('boton-admin');
    const botonEliminar = document.getElementById('btn-eliminar-cuenta'); // Agregar esta línea

    if (botonAdmin) {
        if (esAdministrador(usuarioActual)) {
            botonAdmin.style.display = 'inline-block';
            if (botonEliminar) {
                botonEliminar.style.display = 'none'; // Ocultar eliminar cuenta para admin
            }
            console.log('Botón admin visible para:', usuarioActual.email);
        } else {
            botonAdmin.style.display = 'none';
            if (botonEliminar) {
                botonEliminar.style.display = 'inline-block'; // Mostrar eliminar cuenta para no admin
            }
        }
    }
}

// ======================================================
// 🔹 CONTROL DE INTERFAZ DE USUARIO
// ======================================================

function actualizarInterfazUsuario() {
    const botonesAuth = document.getElementById('botones-autenticacion');
    const estadoUsuario = document.getElementById('estado-usuario');
    const nombreUsuario = document.getElementById('nombre-usuario');

    if (usuarioActual) {
        if (botonesAuth) {
            botonesAuth.style.display = 'none';
        }
        
        if (estadoUsuario && nombreUsuario) {
            estadoUsuario.style.display = 'flex';
            nombreUsuario.textContent = usuarioActual.nombre;
        }
        
        // 🔥 MOSTRAR BOTÓN DE ADMINISTRACIÓN SI ES ADMIN
        mostrarBotonAdministracion();
        
        console.log('✅ Usuario autenticado:', usuarioActual.nombre);
        
    } else {
        if (botonesAuth) {
            botonesAuth.style.display = 'flex';
        }
        
        if (estadoUsuario) {
            estadoUsuario.style.display = 'none';
        }
        
        console.log('❌ Usuario no autenticado');
    }
    
    if (window.location.pathname.includes('menu-principal')) {
        actualizarVistaHistorial(null); // Esto manejará ambos casos
    }
}

// ======================================================
// 🔹 AUTENTICACIÓN - LOGIN
// ======================================================

async function procesarLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }
    
    try {
        // Mostrar estado de carga
        const botonLogin = document.querySelector('#loginForm button[type="submit"]');
        const textoOriginal = botonLogin.innerHTML;
        botonLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        botonLogin.disabled = true;
        
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        // Restaurar botón
        botonLogin.innerHTML = textoOriginal;
        botonLogin.disabled = false;
        
        if (data.success) {
            // Guardar usuario en localStorage
            usuarioActual = data.usuario;
            localStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
            
            //aplicar tema preferido 
            if (data.usuario.tema_preferido) {
                aplicarTema(data.usuario.tema_preferido);
             }

            // Mostrar mensaje de éxito
            if (typeof mostrarMensajeLogin === 'function') {
                mostrarMensaje(`¡Bienvenido ${data.usuario.nombre}! Redirigiendo...`, 'success');
            } 
            
            // 🔥 ACTUALIZAR EL HISTORIAL DESPUÉS DEL LOGIN
            // Pequeño delay para asegurar que todo esté listo
            setTimeout(() => {
                if (window.location.pathname.includes('menu-principal')) {
                    actualizarVistaHistorial(null); // Esto disparará la carga automática
                }
            }, 100);
        
            // Redirigir al menú principal después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            
        } else {
            if (typeof mostrarMensajeLogin === 'function') {
                mostrarMensaje('Error: ' + data.error, 'error');
            }
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        if (typeof mostrarMensajeLogin === 'function') {
            mostrarMensaje('Error de conexión con el servidor. Asegúrate de que Flask esté ejecutándose.', 'error');
        } 
    }
}

// ======================================================
// 🔹 AUTENTICACIÓN - REGISTRO
// ======================================================

async function procesarRegistro() {
    const nombre = document.getElementById('registro-nombre').value;
    const email = document.getElementById('registro-email').value;
    const password = document.getElementById('registro-password').value;
    const confirmarPassword = document.getElementById('registro-confirmar-password').value;
    
    // Validaciones básicas
    if (!nombre || !email || !password || !confirmarPassword) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmarPassword) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
        // Obtener tema preferido
        const temaRadio = document.querySelector('input[name="tema-preferencia"]:checked');
        const temaSeleccionado = temaRadio ? temaRadio.value : 'claro';
        
        const response = await fetch('http://localhost:5000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                tema_preferido: temaSeleccionado
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar usuario en localStorage (loguear automáticamente)
            usuarioActual = data.usuario;
            localStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
            
            // APLICAR TEMA DEL USUARIO
            if (data.usuario.tema_preferido) {
                aplicarTema(data.usuario.tema_preferido);
            }
            
            mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');
            
            // Redirigir al índice después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarMensaje('Error de conexión con el servidor. Asegúrate de que Flask esté ejecutándose.', 'error');
    }
}

// ======================================================
// 🔹 AUTENTICACIÓN - CERRAR SESIÓN
// ======================================================

function cerrarSesion() {
    // Mostrar mensaje de que se está cerrando sesión
    mostrarMensaje('Cerrando sesión...', 'info');
    
    // Esperar 1 segundo antes de cerrar realmente (para que se vea el mensaje)
    setTimeout(() => {
        usuarioActual = null;
        localStorage.removeItem('usuarioActual');
        
        // Actualizar interfaz
        actualizarInterfazUsuario();
        
        // 🔥 FORZAR ACTUALIZACIÓN DEL HISTORIAL EN EL PADRE SI ESTAMOS EN IFRAME
        if (window.parent !== window && typeof window.parent.actualizarInterfazUsuario === 'function') {
            window.parent.actualizarInterfazUsuario();
            window.parent.actualizarVistaHistorial(null);
        }
        
        // 🔥 ACTUALIZAR EL HISTORIAL EN EL COSTADO DERECHO
        if (window.location.pathname.includes('menu-principal')) {
            actualizarVistaHistorial(null);
        }
        
        // Mostrar mensaje de éxito
        mostrarMensaje('Sesión cerrada correctamente', 'success');
        
        // Esperar otro segundo y recargar
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 1000);
}

// ======================================================
// 🔹 AUTENTICACIÓN - ELIMINAR CUENTA
// ======================================================

async function eliminarCuenta() {
    if (!usuarioActual) {
        mostrarMensaje('No hay usuario logueado', 'error');
        return;
    }

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmacion) {
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/eliminar-cuenta', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: usuarioActual.email
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Cuenta eliminada correctamente', 'success');
            // Cerrar sesión y redirigir
            setTimeout(() => {
                usuarioActual = null;
                localStorage.removeItem('usuarioActual');
                window.location.href = '../index.html';
            }, 1500);
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarMensaje('Error de conexión con el servidor. Asegúrate de que Flask esté ejecutándose.', 'error');
    }
}