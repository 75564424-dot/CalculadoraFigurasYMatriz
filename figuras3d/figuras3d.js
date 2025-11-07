// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Figuras 3D inicializadas');
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});

// ======================================================
// 🔹 CÁLCULOS FIGURAS 3D
// ======================================================

// ESFERA
function calcularEsfera(tipoOperacion) {
    try {
        const radio = validarEntrada(
            document.getElementById('entrada-radio-esfera').value,
            'Radio'
        );

        let resultado = 0;
        if (tipoOperacion === 'area') {
            resultado = 4 * Math.PI * radio * radio;
            mostrarResultado('resultado-esfera', `Área Superficial: ${resultado.toFixed(4)} unidades²`);
        } else if (tipoOperacion === 'volumen') {
            resultado = (4 / 3) * Math.PI * radio ** 3;
            mostrarResultado('resultado-esfera', `Volumen: ${resultado.toFixed(4)} unidades³`);
        }
    } catch (error) {
        mostrarResultado('resultado-esfera', null, error.message);
    }
}

function mostrarPasosEsfera() {
    try {
        const radioInput = document.getElementById('entrada-radio-esfera');
        const radio = parseFloat(radioInput.value);

        if (isNaN(radio) || radio <= 0) {
            throw new Error('Ingrese un radio válido mayor que cero');
        }

        const area = 4 * Math.PI * radio * radio;
        const volumen = (4 / 3) * Math.PI * Math.pow(radio, 3);

        const pasosHTML = `
         <strong>🔍 Definimos la variable:</strong><br>
         Sea <em>r = ${radio}</em> unidades<br><br>

         <strong>📐 Área Superficial:</strong><br>
         Fórmula: 4 × π × r²<br>
         Sustituyendo: 4 × ${Math.PI.toFixed(4)} × ${radio}² = ${area.toFixed(4)} unidades²<br><br>

         <strong>📦 Volumen:</strong><br>
         Fórmula: (4/3) × π × r³<br>
         Sustituyendo: (4/3) × ${Math.PI.toFixed(4)} × ${radio}³ = ${volumen.toFixed(4)} unidades³
        `;

        const contenedorPasos = document.getElementById('pasos-esfera');
        contenedorPasos.innerHTML = pasosHTML;
        contenedorPasos.style.display = 'block';
    } catch (error) {
        document.getElementById('pasos-esfera').innerHTML = `<span style="color:red;">${error.message}</span>`;
    }
}

function actualizarTextoRadio() {
    actualizarVisualFigura('entrada-radio-esfera', 'r', 'valor-radio');
}

function limpiarEsfera() {
    document.getElementById('entrada-radio-esfera').value = '';
    document.getElementById('resultado-esfera').innerHTML = '<i class="fas fa-info-circle"></i> Los resultados aparecerán aquí';
    document.getElementById('pasos-esfera').style.display = 'none';
    document.getElementById('valor-radio').textContent = 'r = ';
}

// CUBO
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

// CILINDRO
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