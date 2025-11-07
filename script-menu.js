// ======================================================
// 🔹 CONTROL DE VISIBILIDAD DEL HISTORIAL
// ======================================================

function verHistorial() {
    if (!usuarioActual) {
        mostrarMensaje('Inicia sesión para ver tu historial', 'info');
        return;
    }

    // Si estamos en un iframe, comunicarnos con la ventana principal
    if (window.parent !== window) {
        // Estamos en un iframe - llamar a función del padre
        if (typeof window.parent.cargarHistorialUsuario === 'function') {
            window.parent.cargarHistorialUsuario();
        }
    } else {
        // Estamos en la ventana principal
        cargarHistorialUsuario();
    }
    
    mostrarMensaje('Historial actualizado', 'success');
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
            cargarHistorialUsuario();
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

    if (!historial || historial.length === 0) {
        container.innerHTML = '<div class="sin-historial">No hay cálculos en tu historial</div>';
        return;
    }

    console.log('🎨 Actualizando vista del historial con:', historial.length, 'elementos');

    const historialHTML = historial
        .map((item, index) => `
            <div class="item-historial" style="
                background: rgba(255,255,255,0.1); 
                margin: 8px 0; 
                padding: 12px; 
                border-radius: 8px; 
                border-left: 4px solid #6c5ce7;
            ">
                <div class="fecha" style="font-size: 0.8rem; color: #a29bfe; margin-bottom: 4px;">
                    ${item.fecha || 'Fecha no disponible'}
                </div>
                <div class="calculacion" style="font-size: 0.9rem; color: white;">
                    ${item.calculo || 'Cálculo'}
                </div>
            </div>
        `).join('');

    container.innerHTML = historialHTML;
}

function toggleHistorial() {
    if (!usuarioActual) {
        mostrarMensaje('Inicia sesión para ver tu historial', 'info');
        return;
    }

    const costadoDerecho = document.getElementById('costado-derecho');
    const historialContainer = document.getElementById('historial-usuario');
    
    if (!costadoDerecho || !historialContainer) {
        // Si no estamos en menu-principal, llamar a verHistorial normal
        verHistorial();
        return;
    }

    // Alternar visibilidad
    if (costadoDerecho.style.display === 'none') {
        costadoDerecho.style.display = 'block';
        cargarHistorialUsuario();
        mostrarMensaje('Historial mostrado', 'success');
    } else {
        costadoDerecho.style.display = 'none';
        mostrarMensaje('Historial oculto', 'info');
    }
}

// 🔹 INICIALIZAR HISTORIAL AL CARGAR
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de menú cargado');
    
    // Cargar historial si hay usuario logueado
    setTimeout(() => {
        if (usuarioActual) {
            console.log('👤 Usuario detectado, cargando historial...');
            cargarHistorialUsuario();
        }
    }, 1000);
});