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
    if(!pasosDiv) {
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
    // 🔹 Funciones auxiliares
    // ============================
    function validarNumero(valor) {
        const num = parseFloat(valor);
        return !isNaN(num);
    }

    function obtenerMatriz() {
        const matriz = [];
        for (let i = 0; i < 4; i++) {
            const fila = [];
            for (let j = 0; j < 4; j++) {
                const input = document.getElementById(`m${i}${j}`);
                if(!input) { alert(`Error: input m${i}${j} no encontrado`); return null; }
                const valor = input.value.trim();
                if(valor === '') { alert('Todos los campos deben estar completos'); return null; }
                if(!validarNumero(valor)) { alert('Todos los campos deben ser números'); return null; }
                fila.push(parseFloat(valor));
            }
            matriz.push(fila);
        }
        return matriz;
    }

    function determinante3x3(m) {
        return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
             - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
             + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
    }

    function obtenerSubmatriz(m, fila, col) {
        const sub = [];
        for(let i=0; i<4; i++){
            if(i===fila) continue;
            const filaSub = [];
            for(let j=0; j<4; j++){
                if(j===col) continue;
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

    // ============================
    // 🔹 Resolver determinante paso a paso
    // ============================
    function resolverDeterminantePasoAPaso(matriz) {
        const pasos = [];
        pasos.push('<strong>🔍 Resolviendo determinante de matriz 4x4 mediante expansión por cofactores de la primera fila:</strong><br>');

        const signos = [1,-1,1,-1];
        let total = 0;

        for (let j = 0; j < 4; j++) {
            const elemento = matriz[0][j];
            const sub = obtenerSubmatriz(matriz,0,j);
            const detSub = determinante3x3(sub);
            const producto = signos[j]*elemento*detSub;
            total += producto;

            pasos.push(`
                <div style="margin-bottom:10px; padding:8px; border-left:5px solid #2196F3; border-radius:4px;">
                    <strong>Paso ${j+1}:</strong> Se toma el elemento <strong>${elemento}</strong> de la primera fila.<br>
                    Se calcula la determinante de la submatriz 3x3 correspondiente:<br>
                    ${formatearSubmatriz(sub)}
                    Determinante de submatriz: <strong>${detSub.toFixed(3)}</strong><br>
                    Producto con el signo (${signos[j]>0 ? '+' : '−'}): <strong>${producto.toFixed(3)}</strong>
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
    if(calcularDetBtn){
        calcularDetBtn.addEventListener('click',()=>{
            const matriz = obtenerMatriz();
            if(!matriz) return;

            const det = resolverDeterminantePasoAPaso(matriz);
            resultadoDiv.innerHTML = `<h3>Determinante: ${det.toFixed(3)}</h3>`;
            matrizCalculada = true;
            pasosGenerados = false;
            pasosDiv.style.display = 'none';
            actualizarColorPasos();
        });
    }

    if(verPasosBtn){
        verPasosBtn.addEventListener('click',()=>{
            if(!matrizCalculada){ alert('Primero calcula la determinante'); return; }
            pasosDiv.innerHTML = pasosSolucion;
            pasosDiv.style.display = 'block';
            pasosGenerados = true;
            actualizarColorPasos();
        });
    }

    if(imprimirBtn){
        imprimirBtn.addEventListener('click',()=>{
            if(!matrizCalculada){ alert('Primero calcula la determinante'); return; }
            if(!pasosGenerados){ alert('Primero muestra los pasos'); return; }

            const matriz = obtenerMatriz();
            if(!matriz) return;

            // Construir tabla matriz
            let tabla = '<table style="border-collapse: collapse;">';
            for(let i=0;i<4;i++){
                tabla+='<tr>';
                for(let j=0;j<4;j++){
                    tabla+=`<td style="border:1px solid #000;padding:5px;text-align:center">${matriz[i][j]}</td>`;
                }
                tabla+='</tr>';
            }
            tabla+='</table>';

            // Crear contenedor de impresión
            const imprimirDiv = document.createElement('div');
            imprimirDiv.id = 'area-impresion';
            imprimirDiv.innerHTML = `
                <h2>🔢 Determinante de Matriz 4x4</h2>
                <div class="matriz">${tabla}</div>
                <div class="resultado"><strong>Resultado:</strong><br>${resultadoDiv.innerHTML}</div>
                <div class="pasos">${pasosSolucion}</div>
            `;

            // Ajustar colores según modo
            const body = document.body;
            const pasosCont = imprimirDiv.querySelector('.pasos');
            if(body.classList.contains('dark-mode')){
                pasosCont.style.backgroundColor = '#333';
                pasosCont.style.color = '#fff';
                pasosCont.style.border = '1px solid #555';
                pasosCont.style.padding = '10px';
                pasosCont.style.borderRadius = '5px';
            } else {
                pasosCont.style.backgroundColor = '#f9f9f9';
                pasosCont.style.color = '#000';
                pasosCont.style.border = '1px solid #ccc';
                pasosCont.style.padding = '10px';
                pasosCont.style.borderRadius = '5px';
            }

            document.body.appendChild(imprimirDiv);
            window.print();
            document.body.removeChild(imprimirDiv);
        });
    }

    if(limpiarBtn){
        limpiarBtn.addEventListener('click',()=>{
            for(let i=0;i<4;i++){
                for(let j=0;j<4;j++){
                    document.getElementById(`m${i}${j}`).value='';
                }
            }
            resultadoDiv.innerHTML='';
            pasosDiv.style.display='none';
            matrizCalculada=false;
            pasosGenerados=false;
            pasosSolucion='';
        });
    }

    if(volverBtn){
        volverBtn.addEventListener('click',()=>window.location.href='../index.html');
    }

    // ============================
    // 🔹 Ajuste de color según modo
    // ============================
    function actualizarColorPasos() {
        const body = document.body;
        if(body.classList.contains('dark-mode')){
            pasosDiv.style.color = '#fff';
            pasosDiv.style.backgroundColor = '#333';
        } else {
            pasosDiv.style.color = '#000';
            pasosDiv.style.backgroundColor = '#f9f9f9';
        }
    }

    // Llamamos al cargar la página
    actualizarColorPasos();

    // Actualizar cuando cambie el modo
    const modoBtn = document.getElementById('modoBtn');
    if(modoBtn){
        modoBtn.addEventListener('click', ()=>{
            setTimeout(actualizarColorPasos, 100);
        });
    }

});