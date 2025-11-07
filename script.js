// ======================================================
// 🔹 VARIABLES GLOBALES
// ======================================================

let usuarioActual = null;

// ======================================================
// 🔹 INICIALIZACIÓN
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    
    // Cargar usuario si existe
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
        usuarioActual = JSON.parse(usuarioGuardado);
    }
    
    // Cargar tema (prioridad: usuario logueado > tema guardado > claro)
    let tema = 'claro';
    if (usuarioActual && usuarioActual.tema_preferido) {
        tema = usuarioActual.tema_preferido;
    } else {
        const modoGuardado = localStorage.getItem('modo');
        if (modoGuardado) tema = modoGuardado;
    }
    
    aplicarTema(tema);
    
    // Actualizar interfaz según estado de autenticación
    actualizarInterfazUsuario();
    
    // 🔥 INICIALIZAR HISTORIAL SI ESTAMOS EN MENÚ PRINCIPAL
    if (window.location.pathname.includes('menu-principal')) {
        console.log('🚀 Inicializando historial en menú principal');
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            inicializarHistorial();
        }, 500);
    }
});

// 🔥 DETECTAR CAMBIOS EN EL LOCALSTORAGE (para sincronización entre pestañas/ventanas)
window.addEventListener('storage', function(e) {
    if (e.key === 'usuarioActual') {
        const usuarioGuardado = localStorage.getItem('usuarioActual');
        usuarioActual = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
        actualizarInterfazUsuario();
        
        if (window.location.pathname.includes('menu-principal')) {
            if (usuarioActual) {
                cargarHistorialUsuario();
            } else {
                actualizarVistaHistorial(null);
            }
        }
    }
});

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
// 🔹 SISTEMA DE MENSAJES FLOTANTES
// ======================================================

function mostrarMensaje(mensaje, tipo = 'info') {
    // 🔥 Solo enviar mensaje a la nube del sistema (menu-principal)
    if (window.parent && typeof window.parent.agregarMensajeANube === 'function') {
        window.parent.agregarMensajeANube(mensaje, tipo);
    } else if (typeof agregarMensajeANube === 'function') {
        // Si estamos en menu-principal, usar la función local
        agregarMensajeANube(mensaje, tipo);
    } else {
        // Fallback: si no estamos en un iframe o el padre no tiene la función, mostrar en consola
        console.log(`Mensaje (${tipo}): ${mensaje}`);
    }
}

function agregarMensajeANube(mensaje, tipo = 'info') {
    const nubeMensajes = document.getElementById('nube-mensajes');
    if (!nubeMensajes) return;

    const mensajeItem = document.createElement('div');
    mensajeItem.className = `mensaje-item ${tipo}`;
    
    let icono = 'fa-info-circle';
    if (tipo === 'success') icono = 'fa-check-circle';
    if (tipo === 'error') icono = 'fa-exclamation-triangle';
    if (tipo === 'info') icono = 'fa-info-circle';

    mensajeItem.innerHTML = `
        <i class="fas ${icono}"></i>
        <span>${mensaje}</span>
    `;

    // Agregar el mensaje al principio (los más recientes primero)
    nubeMensajes.insertBefore(mensajeItem, nubeMensajes.firstChild);

    // Auto-eliminar después de 5 segundos 
    setTimeout(() => {
        if (mensajeItem.parentNode) {
            mensajeItem.remove();
        }
    }, 5000);
}

// ======================================================
// 🔹 CONTROL DE HISTORIAL
// ======================================================

function inicializarHistorial() {
    console.log('📚 Inicializando sistema de historial');
    
    // 🔥 SIMPLEMENTE ACTUALIZAR LA VISTA - ella manejará si hay usuario o no
    actualizarVistaHistorial(null);
}

function toggleHistorial() {
    // Si no hay usuario, mostrar mensaje específico
    if (!usuarioActual) {
        mostrarMensaje('Inicia sesión para ver tu historial de cálculos', 'info');
        return;
    }

    // 🔥 SIEMPRE comunicarnos con la ventana padre cuando estamos en iframe
    if (window.parent !== window) {
        // Estamos en un iframe (index.html dentro de menu-principal)
        console.log('🔄 Comunicando con ventana padre para toggle historial');
        
        // Solo enviar mensaje al padre, NO redirigir
        if (typeof window.parent.toggleHistorial === 'function') {
            window.parent.toggleHistorial();
        } else {
            // Fallback: mostrar mensaje
            mostrarMensaje('Historial disponible en el panel derecho', 'info');
        }
        return;
    }

    // 🔥 SOLO este código se ejecuta si estamos en menu-principal.html (ventana principal)
    const costadoDerecho = document.getElementById('costado-derecho');
    
    if (!costadoDerecho) {
        console.log('❌ Elemento costado-derecho no encontrado');
        return;
    }

    // Alternar visibilidad del panel derecho
    if (costadoDerecho.style.display === 'none' || costadoDerecho.style.display === '') {
        costadoDerecho.style.display = 'block';
        // Actualizar el historial
        actualizarVistaHistorial(null);
        mostrarMensaje('Historial mostrado', 'success');
    } else {
        costadoDerecho.style.display = 'none';
        mostrarMensaje('Historial oculto', 'info');
    }
}

function verHistorial() {
    // Esta función ahora es básicamente un alias de toggleHistorial
    toggleHistorial();
}

async function cargarHistorialUsuario() {
    console.log('🔹 Cargando historial para:', usuarioActual?.email);
    
    if (!usuarioActual) {
        actualizarVistaHistorial(null);
        return;
    }

    try {
        // Mostrar estado de carga
        const container = document.getElementById('historial-usuario');
        if (container) {
            container.innerHTML = '<div class="sin-historial">Cargando historial...</div>';
        }

        const response = await fetch(`http://localhost:5000/api/historial/${encodeURIComponent(usuarioActual.email)}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Historial cargado:', data.historial?.length, 'elementos');
            actualizarVistaHistorial(data.historial);
        } else {
            console.error('❌ Error al cargar historial:', data.error);
            mostrarMensaje('Error al cargar historial: ' + data.error, 'error');
            actualizarVistaHistorial([]);
        }
    } catch (error) {
        console.error('❌ Error de conexión al cargar historial:', error);
        mostrarMensaje('Error de conexión al cargar historial', 'error');
        actualizarVistaHistorial([]);
    }
}

// Función para agregar un cálculo al historial
async function agregarAlHistorial(tipoCalculo, datos, resultado) {
    if (!usuarioActual) {
        console.log('⚠️ No hay usuario logueado, no se guardará en historial');
        return false;
    }

    try {
        const descripcion = `${tipoCalculo}: ${datos} = ${resultado}`;
        console.log('💾 Guardando en historial:', descripcion);
        
        const response = await fetch('http://localhost:5000/api/historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: usuarioActual.email,
                calculo: descripcion
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            console.log('✅ Guardado en historial exitoso');
            // Recargar el historial para mostrar el nuevo cálculo
            if (window.location.pathname.includes('menu-principal')) {
                cargarHistorialUsuario();
            }
            return true;
        } else {
            console.error('❌ Error al guardar en historial:', data.error);
            mostrarMensaje('Error al guardar en historial: ' + data.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ Error de conexión al guardar en historial:', error);
        mostrarMensaje('Error de conexión al guardar en historial', 'error');
        return false;
    }
}

function actualizarVistaHistorial(historial) {
    const container = document.getElementById('historial-usuario');
    if (!container) {
        console.log('⚠️ Contenedor de historial no encontrado');
        return;
    }

    // 🔥 SI NO HAY USUARIO, MOSTRAR MENSAJE DE INICIO DE SESIÓN
    if (!usuarioActual) {
        container.innerHTML = '<div class="sin-historial">Inicia sesión para ver tu historial de cálculos</div>';
        return;
    }

    // 🔥 SI HAY USUARIO PERO NO HAY DATOS DEL HISTORIAL, CARGAR
    if (historial === null) {
        container.innerHTML = '<div class="sin-historial">Cargando historial...</div>';
        cargarHistorialUsuario(); // 🔥 CARGAR AUTOMÁTICAMENTE
        return;
    }

    if (!historial || historial.length === 0) {
        container.innerHTML = '<div class="sin-historial">No hay cálculos en tu historial</div>';
        return;
    }

    console.log('🎨 Actualizando vista del historial con:', historial.length, 'elementos');

    const historialHTML = historial
        .map((item, index) => `
            <div class="item-historial">
                <div class="fecha">${item.fecha || 'Fecha no disponible'}</div>
                <div class="calculacion">${item.calculo || 'Cálculo'}</div>
            </div>
        `).join('');

    container.innerHTML = historialHTML;
}
// ======================================================
// 🔹 FUNCIONES DE TEMA
// ======================================================

function aplicarTema(tema) {
    const body = document.body;
    const boton = document.querySelector('.boton[onclick="alternarModoOscuro()"]');
    
    if (tema === 'oscuro') {
        body.classList.add('modo-oscuro');
        if (boton) {
            boton.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        }
        
        // 🔥 Solo aplicar clase al menú principal (sin botón)
        if (window.parent !== window && window.parent.document) {
            window.parent.document.body.classList.add('modo-oscuro');
        }
        
    } else {
        body.classList.remove('modo-oscuro');
        if (boton) {
            boton.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        }
        
        // Aplicar clase al menú principal (sin botón)
        if (window.parent !== window && window.parent.document) {
            window.parent.document.body.classList.remove('modo-oscuro');
        }
    }
    
    localStorage.setItem('modo', tema);
    
    // 🔥 Sincronizar localStorage del menú principal
    if (window.parent !== window) {
        window.parent.localStorage.setItem('modo', tema);
    }
}

function alternarModoOscuro() {
    const temaActual = document.body.classList.contains('modo-oscuro') ? 'oscuro' : 'claro';
    const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
    
    aplicarTema(nuevoTema);
    mostrarMensaje(`Modo ${nuevoTema === 'oscuro' ? 'oscuro' : 'claro'} activado`, 'success');
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
            
            // APLICAR TEMA DEL USUARIO
            const temaActual = document.body.classList.contains('modo-oscuro') ? 'oscuro' : 'claro';
            const temaDeseado = data.usuario.tema_preferido;
            
            if (temaActual !== temaDeseado) {
                aplicarTema(temaDeseado);
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
            const temaActual = document.body.classList.contains('modo-oscuro') ? 'oscuro' : 'claro';
            const temaDeseado = data.usuario.tema_preferido;
            
            if (temaActual !== temaDeseado) {
                aplicarTema(temaDeseado);
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

// ======================================================
// 🔹 UTILIDADES GENERALES
// ======================================================

// Función para validar entrada numérica
function validarEntrada(valor, nombre) {
    const valorStr = String(valor).trim();

    if (valorStr === "") {
        throw new mostrarMensaje(`${nombre} no puede estar vacío`);
    }
    if (/[a-zA-Z]/.test(valorStr)) {
        throw new mostrarMensaje(`No se permiten letras en ${nombre}`);
    }
    if (/[^0-9.\-]/.test(valorStr)) {
        throw new mostrarMensaje(`No se permiten caracteres especiales en ${nombre}`);
    }

    const numero = parseFloat(valorStr);
    if (isNaN(numero)) {
        throw new mostrarMensaje(`${nombre} debe ser un número válido`);
    }
    if (numero <= 0) {
        throw new mostrarMensaje(`No se permiten números negativos en ${nombre}`);
    }

    return numero;
}

// Función para mostrar resultados
function mostrarResultado(idElemento, textoResultado, mensajeError = null) {
    const elementoResultado = document.getElementById(idElemento);

    if (mensajeError) {
        elementoResultado.innerHTML = `<div class="error">${mensajeError}</div>`;
        // 🔥 Solo mostrar errores en la nube
        mostrarMensaje(mensajeError, 'error');
    } else {
        elementoResultado.innerHTML = textoResultado;
    }
}

// Módulo genérico para actualizar texto visual
function actualizarVisualFigura(inputId, prefijo, destinoId) {
    const valor = document.getElementById(inputId).value;
    const elemento = document.getElementById(destinoId);
    if (elemento) {
        elemento.textContent = `${prefijo} = ${valor}`;
    }
}

// ======================================================
// VERIFICACIÓN DE ADMINISTRADOR (USANDO ROL DEL BACKEND)
// ======================================================

function esAdministrador(usuario) {
    return usuario && usuario.rol === 'admin';
}

function mostrarBotonAdministracion() {
    const botonAdmin = document.getElementById('boton-admin');
    if (botonAdmin) {
        if (esAdministrador(usuarioActual)) {
            botonAdmin.style.display = 'inline-block';
            console.log('Botón admin visible para:', usuarioActual.email);
        } else {
            botonAdmin.style.display = 'none';
        }
    }
}