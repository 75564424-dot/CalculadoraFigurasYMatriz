// ======================================================
// 🔹 INICIALIZACIÓN FIGURAS 2D
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Figuras 2D inicializadas');
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});

// ======================================================
// 🔹 CUADRADO - Funciones específicas
// ======================================================

function calcularCuadrado2D(tipoOperacion) {
    try {
        const lado = validarEntrada(
            document.getElementById('entrada-lado-cuadrado').value,
            'Lado'
        );

        let resultado = 0;
        let operacion = '';
        let textoResultado = '';

        if (tipoOperacion === 'area') {
            resultado = lado * lado;
            operacion = 'Área del Cuadrado';
            textoResultado = `Área: ${resultado.toFixed(4)} unidades²`;
        } else if (tipoOperacion === 'perimetro') {
            resultado = 4 * lado;
            operacion = 'Perímetro del Cuadrado';
            textoResultado = `Perímetro: ${resultado.toFixed(4)} unidades`;
        }

        mostrarResultado('resultado-cuadrado-2d', textoResultado);
        // 🔥 AGREGAR AL HISTORIAL
        agregarAlHistorial(operacion, `Lado: ${lado}`, resultado.toFixed(4));

    } catch (error) {
        mostrarResultado('resultado-cuadrado-2d', null, error.message);
    }
}

function mostrarPasosCuadrado() {
    try {
        const ladoInput = document.getElementById('entrada-lado-cuadrado');
        const lado = parseFloat(ladoInput.value);

        if (isNaN(lado) || lado <= 0) {
            throw new Error('Ingrese un lado válido mayor que cero');
        }

        const area = lado * lado;
        const perimetro = 4 * lado;

        const pasosHTML = `
            <strong>🔍 Definimos la variable:</strong><br>
            Sea <em>l = ${lado}</em> unidades<br><br>

            <strong>📐 Área:</strong><br>
            Fórmula: l × l<br>
            Sustituyendo: ${lado} × ${lado} = ${area.toFixed(4)} unidades²<br><br>

            <strong>📏 Perímetro:</strong><br>
            Fórmula: 4 × l<br>
            Sustituyendo: 4 × ${lado} = ${perimetro.toFixed(4)} unidades
        `;

        const contenedorPasos = document.getElementById('pasos-cuadrado');
        contenedorPasos.innerHTML = pasosHTML;
        contenedorPasos.style.display = 'block';
    } catch (error) {
        const contenedorPasos = document.getElementById('pasos-cuadrado');
        contenedorPasos.innerHTML = `<span style="color:red;">${error.message}</span>`;
        contenedorPasos.style.display = 'block';
    }
}

function actualizarVisualCuadrado() {
    actualizarVisualFigura('entrada-lado-cuadrado', 'lado', 'valor-lado');
}

function limpiarCuadrado() {
    document.getElementById('entrada-lado-cuadrado').value = '';
    document.getElementById('resultado-cuadrado-2d').innerHTML = '<i class="fas fa-info-circle"></i> Los resultados aparecerán aquí';
    const pasosElement = document.getElementById('pasos-cuadrado');
    if (pasosElement) {
        pasosElement.style.display = 'none';
        pasosElement.innerHTML = '';
    }
    document.getElementById('valor-lado').textContent = 'lado = ';
}
