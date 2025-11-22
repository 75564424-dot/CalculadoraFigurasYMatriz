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