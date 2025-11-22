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