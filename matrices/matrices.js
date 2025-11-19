// ======================================================
// 🔹 INICIALIZACIÓN MATRICES
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Módulo de Matrices inicializado');
    crearEntradasMatriz();
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});

// ======================================================
// 🔹 FUNCIONES MATRICES
// ======================================================

// Crear inputs de la matriz 4x4
function crearEntradasMatriz() {
    const contenedor = document.getElementById('contenedor-cuadricula-matriz');
    contenedor.innerHTML = '';

    mostrarResultado('resultado-matriz', '');
    const pasos = document.getElementById('pasos-resolucion');
    if (pasos) {
        pasos.innerHTML = '';
        pasos.style.display = 'none';
    }

    for (let i = 0; i < 16; i++) {
        const input = document.createElement('input');
        input.className = 'entrada-matriz';
        input.step = '0.1';
        input.id = `entrada-matriz-${i}`;
        input.placeholder = '';
        input.autocomplete = 'off';
        input.value = '';

        input.addEventListener('input', function() {
            const valor = this.value;

            if (/[a-zA-Z]/.test(valor)) {
                mostrarMensaje('resultado-matriz', null, `No se permiten letras en la posición ${i + 1}`);
                this.value = valor.replace(/[a-zA-Z]/g, '');
                return;
            }
            if (/[^0-9.\-]/.test(valor)) {
                mostrarMensaje('resultado-matriz', null, `No se permiten caracteres especiales en la posición ${i + 1}`);
                this.value = valor.replace(/[^0-9.\-]/g, '');
                return;
            }

            mostrarResultado('resultado-matriz', '');
        });

        contenedor.appendChild(input);
    }
}

// Limpia las entradas y resultados de la matriz
function limpiarEntradasMatriz() {
    for (let i = 0; i < 16; i++) {
        const campo = document.getElementById(`entrada-matriz-${i}`);
        if (campo) campo.value = '';
    }

    mostrarResultado('resultado-matriz', '');

    const contenedorPasos = document.getElementById('pasos-resolucion');
    if (contenedorPasos) {
        contenedorPasos.style.display = 'none';
        contenedorPasos.innerHTML = '';
    }
}

// Obtiene los valores de la matriz como un array 4x4
function obtenerValoresMatriz() {
    const matriz = [];

    for (let fila = 0; fila < 4; fila++) {
        matriz[fila] = [];
        for (let col = 0; col < 4; col++) {
            const inputId = `entrada-matriz-${fila * 4 + col}`;
            const valorTexto = document.getElementById(inputId).value.trim();

            if (valorTexto === '') {
                throw new Error(`⚠️ El campo (${fila + 1}, ${col + 1}) está vacío. Completa todos los valores antes de calcular.`);
            }

            const valor = parseFloat(valorTexto);
            if (isNaN(valor)) {
                throw new Error(`⚠️ El campo (${fila + 1}, ${col + 1}) contiene un valor inválido.`);
            }

            matriz[fila][col] = valor;
        }
    }

    return matriz;
}

// Calcula el determinante de la matriz 4x4
function calcularDeterminante() {
    try {
        const matriz = obtenerValoresMatriz();
        const resultado = calcularDeterminante4x4(matriz);
        mostrarResultado('resultado-matriz', `Determinante: ${resultado.toFixed(6)}`);
    } catch (error) {
        mostrarResultado('resultado-matriz', null, error.message);
    }
}

// Determinante 4x4 por expansión de cofactores
function calcularDeterminante4x4(matriz) {
    return (
        matriz[0][0] * calcularDeterminante3x3([
            [matriz[1][1], matriz[1][2], matriz[1][3]],
            [matriz[2][1], matriz[2][2], matriz[2][3]],
            [matriz[3][1], matriz[3][2], matriz[3][3]]
        ]) -
        matriz[0][1] * calcularDeterminante3x3([
            [matriz[1][0], matriz[1][2], matriz[1][3]],
            [matriz[2][0], matriz[2][2], matriz[2][3]],
            [matriz[3][0], matriz[3][2], matriz[3][3]]
        ]) +
        matriz[0][2] * calcularDeterminante3x3([
            [matriz[1][0], matriz[1][1], matriz[1][3]],
            [matriz[2][0], matriz[2][1], matriz[2][3]],
            [matriz[3][0], matriz[3][1], matriz[3][3]]
        ]) -
        matriz[0][3] * calcularDeterminante3x3([
            [matriz[1][0], matriz[1][1], matriz[1][2]],
            [matriz[2][0], matriz[2][1], matriz[2][2]],
            [matriz[3][0], matriz[3][1], matriz[3][2]]
        ])
    );
}

// Determinante 3x3 (regla de Sarrus)
function calcularDeterminante3x3(matriz) {
    return (
        matriz[0][0] * (matriz[1][1] * matriz[2][2] - matriz[1][2] * matriz[2][1]) -
        matriz[0][1] * (matriz[1][0] * matriz[2][2] - matriz[1][2] * matriz[2][0]) +
        matriz[0][2] * (matriz[1][0] * matriz[2][1] - matriz[1][1] * matriz[2][0])
    );
}

// ======================================================
// 🔹 PASOS DE RESOLUCIÓN MATRIZ
// ======================================================

// Obtiene submatriz excluyendo fila y columna
function obtenerSubmatriz(matriz, filaExcluir, columnaExcluir) {
    const submatriz = [];

    for (let i = 0; i < matriz.length; i++) {
        if (i === filaExcluir) continue;

        const fila = [];
        for (let j = 0; j < matriz[i].length; j++) {
            if (j === columnaExcluir) continue;
            fila.push(matriz[i][j]);
        }

        submatriz.push(fila);
    }

    return submatriz;
}

// Muestra los pasos de la resolución del determinante
function resolverDeterminantePasoAPaso(matriz) {
    const pasos = [];

    pasos.push('🔍 Resolviendo determinante de matriz 4x4 por expansión de la primera fila:');

    for (let j = 0; j < 4; j++) {
        const signo = (j % 2 === 0) ? '+' : '−';
        const elemento = matriz[0][j];
        const submatriz = obtenerSubmatriz(matriz, 0, j);
        const detSub = calcularDeterminante3x3(submatriz);
        const producto = elemento * detSub * (signo === '+' ? 1 : -1);

        pasos.push(`${signo} (${elemento}) × det:<br>${formatearSubmatriz(submatriz)} = <strong>${producto.toFixed(3)}</strong><br><br>`);
    }

    const total = calcularDeterminante4x4(matriz);
    pasos.push(`<strong>✅ Determinante total: ${total.toFixed(6)}</strong>`);

    return pasos;
}

function mostrarPasosResolucion() {
    try {
        const matrizInputs = document.querySelectorAll('#contenedor-cuadricula-matriz input');
        const resultadoContenedor = document.getElementById('resultado-matriz');
        const pasosContenedor = document.getElementById('pasos-resolucion');

        const resultadoHTML = resultadoContenedor.innerHTML.trim();

        // Validación: matriz completa
        const matrizCompleta = Array.from(matrizInputs).every(input => input.value.trim() !== '');
        if (!matrizCompleta) throw new Error('⚠️ La matriz contiene campos vacíos. Completa todos los valores.');

        // Validación: resultado calculado
        if (
            resultadoHTML === '' ||
            resultadoHTML.includes('Los resultados aparecerán aquí') ||
            resultadoHTML.includes('Error')
        ) {
            throw new Error('⚠️ Debes calcular el determinante antes de ver los pasos.');
        }

        // Obtener matriz como array numérico
        const matriz = obtenerValoresMatriz();

        // Generar pasos
        const pasos = resolverDeterminantePasoAPaso(matriz);
        pasosContenedor.innerHTML = pasos.join('<br>');
        pasosContenedor.style.display = 'block';

    } catch (error) {
        // Mostrar el error en el área de resultado
        const resultadoContenedor = document.getElementById('resultado-matriz');
        resultadoContenedor.innerHTML = `<span style="color: red;">${error.message}</span>`;

        // Ocultar los pasos si hay error
        const pasosContenedor = document.getElementById('pasos-resolucion');
        pasosContenedor.innerHTML = '';
        pasosContenedor.style.display = 'none';
    }
}

// Devuelve la submatriz en formato HTML (tabla)
function formatearSubmatriz(submatriz) {
    let html = '<table class="submatriz">';
    for (const fila of submatriz) {
        html += '<tr>';
        for (const valor of fila) {
            html += `<td>${valor}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function imprimirResolucion() {
    try {
        const matriz = document.querySelectorAll('#contenedor-cuadricula-matriz input');
        const resultadoContenedor = document.getElementById('resultado-matriz');
        const pasosContenedor = document.getElementById('pasos-resolucion');

        const resultadoHTML = resultadoContenedor.innerHTML.trim();
        const pasosHTML = pasosContenedor.innerHTML.trim();

        // Validación: matriz completa
        const matrizCompleta = Array.from(matriz).every(input => input.value.trim() !== '');
        if (!matrizCompleta) throw new Error('⚠️ La matriz contiene campos vacíos.');

        // Validación: resultado calculado
        if (
            resultadoHTML === '' ||
            resultadoHTML.includes('Los resultados aparecerán aquí') ||
            resultadoHTML.includes('Error')
        ) {
            throw new Error('⚠️ Debes calcular el determinante antes de imprimir.');
        }

        // Validación: pasos generados
        if (
            pasosHTML === '' ||
            pasosHTML.includes('Los pasos aparecerán aquí') ||
            pasosHTML.includes('Debe presionar el botón')
        ) {
            throw new Error('⚠️ Debes presionar el botón "Mostrar pasos" antes de imprimir.');
        }

        // Construir tabla HTML
        let matrizHTML = '<table>';
        for (let i = 0; i < matriz.length; i++) {
            if (i % 4 === 0) matrizHTML += '<tr>';
            matrizHTML += `<td>${matriz[i].value}</td>`;
            if (i % 4 === 3) matrizHTML += '</tr>';
        }
        matrizHTML += '</table>';

        // Crear contenedor de impresión
        const imprimirDiv = document.createElement('div');
        imprimirDiv.id = 'area-impresion';
        imprimirDiv.innerHTML = `
            <h2>🔢 Determinante de Matriz 4x4</h2>
            <div class="matriz">${matrizHTML}</div>
            <div class="resultado"><strong>Resultado:</strong><br>${resultadoHTML}</div>
            <div class="pasos"><strong>Pasos de resolución:</strong><br>${pasosHTML}</div>
        `;

        // Estilos para impresión
        const estilos = document.createElement('style');
        estilos.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #area-impresion, #area-impresion * { visibility: visible; }
                #area-impresion { position: absolute; left: 0; top: 0; width: 100%; }
                table { border-collapse: collapse; margin-top: 10px; }
                td { border: 1px solid #000; padding: 5px; text-align: center; }
            }
        `;
        imprimirDiv.appendChild(estilos);

        document.body.appendChild(imprimirDiv);
        window.print();
        document.body.removeChild(imprimirDiv);

    } catch (error) {
        const resultadoContenedor = document.getElementById('resultado-matriz');
        resultadoContenedor.innerHTML = `<span style="color: red;">${error.message}</span>`;
    }
}