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
// 🔹 CÍRCULO - Funciones específicas
// ======================================================

function calcularCirculo2D(tipoOperacion) {
    try {
        const radio = validarEntrada(
            document.getElementById('entrada-radio-circulo').value,
            'Radio'
        );

        let resultado = 0;
        let operacion = '';
        let textoResultado = '';

        if (tipoOperacion === 'area') {
            resultado = Math.PI * radio * radio;
            operacion = 'Área del Círculo';
            textoResultado = `Área: ${resultado.toFixed(4)} unidades²`;
        } else if (tipoOperacion === 'perimetro') {
            resultado = 2 * Math.PI * radio;
            operacion = 'Perímetro del Círculo';
            textoResultado = `Perímetro: ${resultado.toFixed(4)} unidades`;
        }

        mostrarResultado('resultado-circulo-2d', textoResultado);
        // Agregar al historial
        agregarAlHistorial(operacion, `Radio: ${radio}`, resultado.toFixed(4));

    } catch (error) {
        mostrarResultado('resultado-circulo-2d', null, error.message);
    }
}

function mostrarPasosCirculo() {
    try {
        const radioInput = document.getElementById('entrada-radio-circulo');
        const radio = parseFloat(radioInput.value);

        if (isNaN(radio) || radio <= 0) {
            throw new Error('Ingrese un radio válido mayor que cero');
        }

        const area = Math.PI * radio * radio;
        const perimetro = 2 * Math.PI * radio;

        const pasosHTML = `
            <strong>🔍 Definimos la variable:</strong><br>
            Sea <em>r = ${radio}</em> unidades<br><br>

            <strong>📐 Área:</strong><br>
            Fórmula: π × r²<br>
            Sustituyendo: ${Math.PI.toFixed(4)} × ${radio}² = ${area.toFixed(4)} unidades²<br><br>

            <strong>📏 Perímetro:</strong><br>
            Fórmula: 2 × π × r<br>
            Sustituyendo: 2 × ${Math.PI.toFixed(4)} × ${radio} = ${perimetro.toFixed(4)} unidades
        `;

        const contenedorPasos = document.getElementById('pasos-circulo');
        contenedorPasos.innerHTML = pasosHTML;
        contenedorPasos.style.display = 'block';
    } catch (error) {
        const contenedorPasos = document.getElementById('pasos-circulo');
        contenedorPasos.innerHTML = `<span style="color:red;">${error.message}</span>`;
        contenedorPasos.style.display = 'block';
    }
}

function actualizarVisualCirculo() {
    actualizarVisualFigura('entrada-radio-circulo', 'radio', 'valor-radio');
}

function limpiarCirculo() {
    document.getElementById('entrada-radio-circulo').value = '';
    document.getElementById('resultado-circulo-2d').innerHTML = '<i class="fas fa-info-circle"></i> Los resultados aparecerán aquí';
    const pasosElement = document.getElementById('pasos-circulo');
    if (pasosElement) {
        pasosElement.style.display = 'none';
        pasosElement.innerHTML = '';
    }
    document.getElementById('valor-radio').textContent = 'radio = ';
}