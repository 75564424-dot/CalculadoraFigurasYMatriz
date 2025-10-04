document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Referencias
    // ============================
    const calcularDetBtn = document.getElementById('calcularDeterminante');
    const verPasosBtn = document.getElementById('verPasos');
    const imprimirBtn = document.getElementById('imprimirSolucion');
    const limpiarBtn = document.getElementById('limpiarMatriz');
    const volverBtn = document.getElementById('volverBtn');
    const resultadoDiv = document.getElementById('resultado');

    // Crear contenedor de pasos debajo del resultado
    let pasosDiv = document.getElementById('pasos-resolucion');
    if (!pasosDiv) {
        pasosDiv = document.createElement('div');
        pasosDiv.id = 'pasos-resolucion';
        pasosDiv.style.marginTop = '1rem';
        pasosDiv.style.textAlign = 'left';
        pasosDiv.style.display = 'none';
        pasosDiv.style.padding = '10px';
        pasosDiv.style.borderRadius = '5px';
        resultadoDiv.insertAdjacentElement('afterend', pasosDiv);
    }

    let matrizCalculada = false;
    let pasosGenerados = false;
    let pasosSolucion = '';

    // ============================
    // 🔹 Obtener matriz
    // ============================
    function obtenerMatriz() {
        const matriz = [];
        for (let i = 0; i < 4; i++) {
            const fila = [];
            for (let j = 0; j < 4; j++) {
                const input = document.getElementById(`m${i}${j}`);
                if (!input) {
                    mostrarMensajeError(`Error: input m${i}${j} no encontrado`);
                    return null;
                }
    
                const valor = input.value.trim();
                if (valor === '') {
                    mostrarMensajeError('❌ Todos los campos deben estar completos.');
                    return null;
                }
    
                // ✅ Validación especial para matrices
                if (!validarNumeroMatriz(valor)) {
                    mostrarMensajeError('⚠️ Los campos deben contener números válidos (pueden ser negativos o cero).');
                    return null;
                }
    
                fila.push(parseFloat(valor));
            }
            matriz.push(fila);
        }
        return matriz;
    }    

    // ============================
    // 🔹 Validación local para matrices
    // (permite números negativos y cero)
    // ============================
    function validarNumeroMatriz(valor) {
        const patron = /^-?\d+(\.\d+)?$/; // acepta negativos y decimales
        return patron.test(valor.trim());
    }

    // ============================
    // 🔹 Mostrar mensajes dentro del resultado
    // ============================
    function mostrarMensajeError(mensaje) {
        resultadoDiv.innerHTML = `<div class="mensaje-error">${mensaje}</div>`;
        pasosDiv.style.display = 'none';
    }

    // ============================
    // 🔹 Cálculo determinante paso a paso
    // ============================
    function determinante3x3(m) {
        return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
            - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
            + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    }

    function obtenerSubmatriz(m, fila, col) {
        const sub = [];
        for (let i = 0; i < 4; i++) {
            if (i === fila) continue;
            const filaSub = [];
            for (let j = 0; j < 4; j++) {
                if (j === col) continue;
                filaSub.push(m[i][j]);
            }
            sub.push(filaSub);
        }
        return sub;
    }

    function formatearSubmatriz(submatriz) {
        let html = '<table style="border-collapse: collapse; margin:5px 0;">';
        for (const fila of submatriz) {
            html += '<tr>';
            for (const valor of fila) {
                html += `<td style="border:1px solid #000; padding:4px; text-align:center;">${valor}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    }

    function resolverDeterminantePasoAPaso(matriz) {
        const pasos = [];
        pasos.push('<strong>🔍 Resolviendo determinante de matriz 4x4 mediante expansión por cofactores de la primera fila:</strong><br>');

        const signos = [1, -1, 1, -1];
        let total = 0;

        for (let j = 0; j < 4; j++) {
            const elemento = matriz[0][j];
            const sub = obtenerSubmatriz(matriz, 0, j);
            const detSub = determinante3x3(sub);
            const producto = signos[j] * elemento * detSub;
            total += producto;

            pasos.push(`
                <div style="margin-bottom:10px; padding:8px; border-left:5px solid #2196F3; border-radius:4px;">
                    <strong>Paso ${j + 1}:</strong> Se toma el elemento <strong>${elemento}</strong> de la primera fila.<br>
                    Submatriz correspondiente:<br>
                    ${formatearSubmatriz(sub)}
                    Determinante de submatriz: <strong>${detSub.toFixed(3)}</strong><br>
                    Producto con el signo (${signos[j] > 0 ? '+' : '−'}): <strong>${producto.toFixed(3)}</strong>
                </div>
            `);
        }

        pasos.push(`
            <div style="margin-top:10px; padding:10px; border-left:5px solid #4CAF50; border-radius:4px;">
                <strong>✅ Determinante total de la matriz 4x4:</strong> ${total.toFixed(3)}
            </div>
        `);

        pasosSolucion = pasos.join('');
        return total;
    }

    // ============================
    // 🔹 Botones
    // ============================
    if (calcularDetBtn) {
        calcularDetBtn.addEventListener('click', () => {
            const matriz = obtenerMatriz();
            if (!matriz) return;

            const det = resolverDeterminantePasoAPaso(matriz);
            resultadoDiv.innerHTML = `<h3>Determinante: ${det.toFixed(3)}</h3>`;
            matrizCalculada = true;
            pasosGenerados = false;
            pasosDiv.style.display = 'none';
            actualizarColorPasos();

            // ✅ Registrar historial global
            guardarHistorialGlobal("Matrices", "Determinante 4x4");
        });
    }

    if (verPasosBtn) {
        verPasosBtn.addEventListener('click', () => {
            if (!matrizCalculada) {
                mostrarMensajeError('Primero calcula la determinante.');
                return;
            }
            pasosDiv.innerHTML = pasosSolucion;
            pasosDiv.style.display = 'block';
            pasosGenerados = true;
            actualizarColorPasos();
        });
    }

    if (imprimirBtn) {
        imprimirBtn.addEventListener('click', () => {
            if (!matrizCalculada) {
                mostrarMensajeError('Primero calcula la determinante.');
                return;
            }
            if (!pasosGenerados) {
                mostrarMensajeError('Primero muestra los pasos.');
                return;
            }
    
            // ✅ Solo imprime la página actual como está
            window.print();
        });
    }    
      
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', () => {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    document.getElementById(`m${i}${j}`).value = '';
                }
            }
            resultadoDiv.innerHTML = '';
            pasosDiv.style.display = 'none';
            matrizCalculada = false;
            pasosGenerados = false;
            pasosSolucion = '';
        });
    }

    if (volverBtn) {
        volverBtn.addEventListener('click', () => window.location.href = '../index.html');
    }

    // ============================
    // 🔹 Ajuste de color
    // ============================
    function actualizarColorPasos() {
        const body = document.body;
        pasosDiv.style.color = body.classList.contains('dark-mode') ? '#fff' : '#000';
        pasosDiv.style.backgroundColor = body.classList.contains('dark-mode') ? '#333' : '#f9f9f9';
    }

    actualizarColorPasos();

    const modoBtn = document.getElementById('modoBtn');
    if (modoBtn) {
        modoBtn.addEventListener('click', () => setTimeout(actualizarColorPasos, 100));
    }

});