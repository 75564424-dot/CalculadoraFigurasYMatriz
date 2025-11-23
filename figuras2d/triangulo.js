// ======================================================
// 🔹 TRIÁNGULO
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