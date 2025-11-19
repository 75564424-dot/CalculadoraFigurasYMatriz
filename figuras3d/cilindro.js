// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Figuras 3D inicializadas');
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});

// ======================================================
// 🔹 CILINDRO
// ======================================================

function calcularCilindro(tipoOperacion) {
    try {
        const radio = validarEntrada(
            document.getElementById('entrada-radio-cilindro').value,
            'Radio'
        );
        const altura = validarEntrada(
            document.getElementById('entrada-altura-cilindro').value,
            'Altura'
        );

        let resultado = 0;
        if (tipoOperacion === 'area') {
            resultado = 2 * Math.PI * radio * (radio + altura);
            mostrarResultado('resultado-cilindro', `Área Superficial: ${resultado.toFixed(4)} unidades²`);
        } else if (tipoOperacion === 'volumen') {
            resultado = Math.PI * radio * radio * altura;
            mostrarResultado('resultado-cilindro', `Volumen: ${resultado.toFixed(4)} unidades³`);
        }
    } catch (error) {
        mostrarResultado('resultado-cilindro', null, error.message);
    }
}

function mostrarPasosCilindro() {
    try {
        const r = parseFloat(document.getElementById('entrada-radio-cilindro').value.trim());
        const h = parseFloat(document.getElementById('entrada-altura-cilindro').value.trim());

        if (isNaN(r) || r <= 0 || isNaN(h) || h <= 0) {
            throw new Error('⚠️ Debes ingresar valores válidos para radio y altura.');
        }

        const area = 2 * Math.PI * r * (r + h);
        const volumen = Math.PI * r * r * h;

        const pasosHTML = `
            <strong>🔍 Definimos las variables:</strong><br>
            Sea <em>r = ${r}</em> unidades, <em>h = ${h}</em> unidades<br><br>

            <strong>📐 Área Superficial:</strong><br>
            Fórmula: 2 × π × r × (r + h)<br>
            Sustituyendo: 2 × ${Math.PI.toFixed(4)} × ${r} × (${r} + ${h}) = ${area.toFixed(4)} unidades²<br><br>

            <strong>📦 Volumen:</strong><br>
            Fórmula: π × r² × h<br>
            Sustituyendo: ${Math.PI.toFixed(4)} × ${r}² × ${h} = ${volumen.toFixed(4)} unidades³
        `;

        const contenedor = document.getElementById('pasos-cilindro');
        contenedor.innerHTML = pasosHTML;
        contenedor.style.display = 'block';

    } catch (error) {
        document.getElementById('resultado-cilindro').innerHTML = `<span style="color:red;">${error.message}</span>`;
        document.getElementById('pasos-cilindro').style.display = 'none';
    }
}

function actualizarVisualCilindro() {
    actualizarVisualFigura('entrada-radio-cilindro', 'r', 'valor-radio-cilindro');
    actualizarVisualFigura('entrada-altura-cilindro', 'h', 'valor-altura-cilindro');
}

function limpiarCilindro() {
    document.getElementById('entrada-radio-cilindro').value = '';
    document.getElementById('entrada-altura-cilindro').value = '';
    document.getElementById('resultado-cilindro').innerHTML = '';
    document.getElementById('pasos-cilindro').style.display = 'none';
    document.getElementById('valor-radio-cilindro').textContent = 'r = 0';
    document.getElementById('valor-altura-cilindro').textContent = 'h = 0';
}