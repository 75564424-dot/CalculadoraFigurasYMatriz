function calcularEsfera(tipoOperacion) {
    try {
        const radio = validarEntrada(
            document.getElementById('entrada-radio-esfera').value,
            'Radio'
        );

        let resultado = 0;
        let tipoCalculo = "";
        let datos = `Radio: ${radio}`;

        if (tipoOperacion === 'area') {
            resultado = 4 * Math.PI * radio * radio;
            tipoCalculo = "Área superficial de la esfera";

            mostrarResultado(
                'resultado-esfera',
                `Área Superficial: ${resultado.toFixed(4)} unidades²`
            );

        } else if (tipoOperacion === 'volumen') {
            resultado = (4 / 3) * Math.PI * radio ** 3;
            tipoCalculo = "Volumen de la esfera";

            mostrarResultado(
                'resultado-esfera',
                `Volumen: ${resultado.toFixed(4)} unidades³`
            );
        }

        agregarAlHistorial(
            tipoCalculo,
            datos,
            resultado.toFixed(4)
        );

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