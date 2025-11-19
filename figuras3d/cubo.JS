// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Figuras 3D inicializadas');
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});

// ======================================================
// 🔹 CUBO
// ======================================================

function calcularCubo(tipoOperacion) {
    try {
        const arista = validarEntrada(
            document.getElementById('entrada-arista-cubo').value,
            'Arista'
        );

        let resultado = 0;
        if (tipoOperacion === 'area') {
            resultado = 6 * arista * arista;
            mostrarResultado('resultado-cubo', `Área Superficial: ${resultado.toFixed(4)} unidades²`);
        } else if (tipoOperacion === 'volumen') {
            resultado = arista ** 3;
            mostrarResultado('resultado-cubo', `Volumen: ${resultado.toFixed(4)} unidades³`);
        }
    } catch (error) {
        mostrarResultado('resultado-cubo', null, error.message);
    }
}

function mostrarPasosCubo() {
    try {
        const aristaInput = document.getElementById('entrada-arista-cubo');
        const a = parseFloat(aristaInput.value);

        if (isNaN(a) || a <= 0) {
            throw new Error('Ingrese una arista válida mayor que cero');
        }

        const area = 6 * a * a;
        const volumen = a ** 3;

        const pasosHTML = `
            <strong>🔍 Definimos la variable:</strong><br>
            Sea <em>a = ${a}</em> unidades<br><br>

            <strong>📐 Área Superficial:</strong><br>
            Fórmula: 6 × a²<br>
            Sustituyendo: 6 × ${a}² = ${area.toFixed(4)} unidades²<br><br>

            <strong>📦 Volumen:</strong><br>
            Fórmula: a³<br>
            Sustituyendo: ${a}³ = ${volumen.toFixed(4)} unidades³
        `;

        const contenedorPasos = document.getElementById('pasos-cubo');
        contenedorPasos.innerHTML = pasosHTML;
        contenedorPasos.style.display = 'block';
    } catch (error) {
        document.getElementById('pasos-cubo').innerHTML = `<span style="color:red;">${error.message}</span>`;
    }
}

function actualizarVisualCubo() {
    actualizarVisualFigura('entrada-arista-cubo', 'a', 'valor-arista');
}

function limpiarCubo() {
    document.getElementById('entrada-arista-cubo').value = '';
    document.getElementById('resultado-cubo').innerHTML = '';
    document.getElementById('pasos-cubo').style.display = 'none';
    document.getElementById('valor-arista').textContent = 'a = 0';
}