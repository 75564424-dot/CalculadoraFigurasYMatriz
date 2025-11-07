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

// ======================================================
// 🔹 TRIÁNGULO - Funciones específicas
// ======================================================

function calcularTriangulo2D(tipoOperacion) {
    try {
        let resultado = 0;
        let operacion = '';
        let datos = '';
        let textoResultado = '';

        if (tipoOperacion === 'area') {
            const base = validarEntrada(
                document.getElementById('entrada-base-triangulo').value,
                'Base'
            );
            const altura = validarEntrada(
                document.getElementById('entrada-altura-triangulo').value,
                'Altura'
            );
            resultado = (base * altura) / 2;
            operacion = 'Área del Triángulo';
            datos = `Base: ${base}, Altura: ${altura}`;
            textoResultado = `Área: ${resultado.toFixed(4)} unidades²`;
            
        } else if (tipoOperacion === 'perimetro') {
            const lado1 = validarEntrada(document.getElementById('entrada-lado1-triangulo').value, 'Lado 1');
            const lado2 = validarEntrada(document.getElementById('entrada-lado2-triangulo').value, 'Lado 2');
            const lado3 = validarEntrada(document.getElementById('entrada-lado3-triangulo').value, 'Lado 3');
            resultado = lado1 + lado2 + lado3;
            operacion = 'Perímetro del Triángulo';
            datos = `Lados: ${lado1}, ${lado2}, ${lado3}`;
            textoResultado = `Perímetro: ${resultado.toFixed(4)} unidades`;
        }

        mostrarResultado('resultado-triangulo-2d', textoResultado);
        // 🔥 AGREGAR AL HISTORIAL
        agregarAlHistorial(operacion, datos, resultado.toFixed(4));

    } catch (error) {
        mostrarResultado('resultado-triangulo-2d', null, error.message);
    }
}

function mostrarPasosTriangulo() {
    try {
        const baseInput = document.getElementById('entrada-base-triangulo');
        const alturaInput = document.getElementById('entrada-altura-triangulo');
        const lado1Input = document.getElementById('entrada-lado1-triangulo');
        const lado2Input = document.getElementById('entrada-lado2-triangulo');
        const lado3Input = document.getElementById('entrada-lado3-triangulo');

        let pasosHTML = '';

        // Verificar si se puede calcular área
        const base = parseFloat(baseInput.value);
        const altura = parseFloat(alturaInput.value);
        
        if (!isNaN(base) && !isNaN(altura) && base > 0 && altura > 0) {
            const area = (base * altura) / 2;
            pasosHTML += `
                <strong>🔍 Variables para área:</strong><br>
                Base <em>b = ${base}</em> unidades, Altura <em>h = ${altura}</em> unidades<br><br>

                <strong>📐 Área:</strong><br>
                Fórmula: (b × h) ÷ 2<br>
                Sustituyendo: (${base} × ${altura}) ÷ 2 = ${area.toFixed(4)} unidades²<br><br>
            `;
        }

        // Verificar si se puede calcular perímetro
        const lado1 = parseFloat(lado1Input.value);
        const lado2 = parseFloat(lado2Input.value);
        const lado3 = parseFloat(lado3Input.value);
        
        if (!isNaN(lado1) && !isNaN(lado2) && !isNaN(lado3) && lado1 > 0 && lado2 > 0 && lado3 > 0) {
            const perimetro = lado1 + lado2 + lado3;
            pasosHTML += `
                <strong>🔍 Variables para perímetro:</strong><br>
                Lado 1 <em>l₁ = ${lado1}</em>, Lado 2 <em>l₂ = ${lado2}</em>, Lado 3 <em>l₃ = ${lado3}</em><br><br>

                <strong>📏 Perímetro:</strong><br>
                Fórmula: l₁ + l₂ + l₃<br>
                Sustituyendo: ${lado1} + ${lado2} + ${lado3} = ${perimetro.toFixed(4)} unidades
            `;
        }

        if (pasosHTML === '') {
            throw new Error('Ingrese valores válidos para calcular área (base y altura) o perímetro (los tres lados)');
        }

        const contenedorPasos = document.getElementById('pasos-triangulo');
        contenedorPasos.innerHTML = pasosHTML;
        contenedorPasos.style.display = 'block';
    } catch (error) {
        const contenedorPasos = document.getElementById('pasos-triangulo');
        contenedorPasos.innerHTML = `<span style="color:red;">${error.message}</span>`;
        contenedorPasos.style.display = 'block';
    }
}

function actualizarVisualTriangulo() {
    const base = (document.getElementById('entrada-base-triangulo').value || "").trim();
    const altura = (document.getElementById('entrada-altura-triangulo').value || "").trim();

    // actualizar altura centrada
    document.getElementById('valor-altura').textContent = altura ? `h = ${altura}` : 'h =';

    // actualizar base abajo
    document.getElementById('valor-base').textContent = base ? `b = ${base}` : 'b =';
}

function limpiarTriangulo() {
    document.getElementById('entrada-base-triangulo').value = '';
    document.getElementById('entrada-altura-triangulo').value = '';
    document.getElementById('entrada-lado1-triangulo').value = '';
    document.getElementById('entrada-lado2-triangulo').value = '';
    document.getElementById('entrada-lado3-triangulo').value = '';
    document.getElementById('resultado-triangulo-2d').innerHTML = '<i class="fas fa-info-circle"></i> Los resultados aparecerán aquí';
    const pasosElement = document.getElementById('pasos-triangulo');
    if (pasosElement) {
        pasosElement.style.display = 'none';
        pasosElement.innerHTML = '';
    }
    document.getElementById('valor-altura').textContent = 'h =';
    document.getElementById('valor-base').textContent = 'b =';
}