document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Volver al menú principal
    // ============================
    const volverBtn = document.getElementById('volverBtn');
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // ============================
    // 🔹 Historial
    // ============================
    const historialBtn = document.getElementById('historialBtn');
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if(historialBtn) {
        historialBtn.addEventListener('click', () => {
            if (!usuarioActual) {
                alert('No hay usuario logeado');
                return;
            }

            const historial = usuarioActual.historial || [];
            if (historial.length === 0) {
                alert('No hay entradas de historial aún');
                return;
            }

            alert('Historial:\n' + historial.map(h => `${h.usuario} - ${h.calculo}`).join('\n'));
        });
    }

    // ============================
    // 🔹 Guardar entrada en historial y navegar
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const calculo = tarjeta.dataset.calculo;
            const href = tarjeta.dataset.href;

            if (usuarioActual && calculo !== 'Círculo') {
                const nuevaEntrada = { usuario: usuarioActual.nombre, calculo };
                usuarioActual.historial = usuarioActual.historial || [];
                usuarioActual.historial.push(nuevaEntrada);
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
            }

            if (href) window.location.href = href;
        });
    });

    // ============================
    // 🔹 Función para validar números positivos
    // ============================
    function validarNumero(valor) {
        const num = parseFloat(valor);
        return !isNaN(num) && num >= 0;
    }

    // ============================
    // 🔹 Referencia al div de resultado
    // ============================
    const resultadoDiv = document.getElementById('resultado');

    // ============================
    // 🔹 Funciones de cálculo
    // ============================
    function calcularAreaCirculo() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const area = Math.PI * r * r;

        resultadoDiv.innerHTML = `
            <h3>Área del Círculo</h3>
            <p>Fórmula: A = π × r²</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>π × r² = ${Math.PI.toFixed(2)} × ${r}²</li>
                <li>Área = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularPerimetroCirculo() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const perimetro = 2 * Math.PI * r;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Círculo</h3>
            <p>Fórmula: P = 2 × π × r</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>2 × π × r = 2 × ${Math.PI.toFixed(2)} × ${r}</li>
                <li>Perímetro = ${perimetro.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularAreaCuadrado() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error al ingresar los datos'); return; }

        const l = parseFloat(lado);
        const area = l * l;

        resultadoDiv.innerHTML = `
            <h3>Área del Cuadrado</h3>
            <p>Fórmula: A = lado²</p>
            <p>Pasos:</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>${l}² = ${area}</li>
            </ul>
        `;
    }

    function calcularPerimetroCuadrado() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error al ingresar los datos'); return; }

        const l = parseFloat(lado);
        const perimetro = 4 * l;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Cuadrado</h3>
            <p>Fórmula: P = 4 × lado</p>
            <p>Pasos:</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>4 × ${l} = ${perimetro}</li>
            </ul>
        `;
    }

    function calcularAreaTriangulo() {
        const base = document.getElementById('base').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(base) || !validarNumero(altura)) { alert('Error al ingresar los datos'); return; }

        const b = parseFloat(base);
        const h = parseFloat(altura);
        const area = (b * h) / 2;

        resultadoDiv.innerHTML = `
            <h3>Área del Triángulo</h3>
            <p>Fórmula: A = (base × altura) / 2</p>
            <p>Pasos:</p>
            <ul>
                <li>Base ingresada: ${b}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Área = (${b} × ${h}) / 2 = ${area}</li>
            </ul>
        `;
    }

    function calcularPerimetroTriangulo() {
        const base = document.getElementById('base').value.trim();
        const lado1 = document.getElementById('lado1').value.trim();
        const lado2 = document.getElementById('lado2').value.trim();
        if (!validarNumero(base) || !validarNumero(lado1) || !validarNumero(lado2)) { alert('Error al ingresar los datos'); return; }

        const b = parseFloat(base);
        const l1 = parseFloat(lado1);
        const l2 = parseFloat(lado2);
        const perimetro = b + l1 + l2;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Triángulo</h3>
            <p>Fórmula: P = base + lado1 + lado2</p>
            <p>Pasos:</p>
            <ul>
                <li>Lados ingresados: ${b}, ${l1}, ${l2}</li>
                <li>Perímetro = ${b} + ${l1} + ${l2} = ${perimetro}</li>
            </ul>
        `;
    }

    // ============================
    // 🔹 Botones de cálculo
    // ============================
    const calcularAreaBtn = document.getElementById('calcularArea');
    const calcularPerimetroBtn = document.getElementById('calcularPerimetro');

    if (calcularAreaBtn) {
        calcularAreaBtn.addEventListener('click', () => {
            if (document.getElementById('radio')) calcularAreaCirculo();
            else if (document.getElementById('lado')) calcularAreaCuadrado();
            else if (document.getElementById('base')) calcularAreaTriangulo();
        });
    }

    if (calcularPerimetroBtn) {
        calcularPerimetroBtn.addEventListener('click', () => {
            if (document.getElementById('radio')) calcularPerimetroCirculo();
            else if (document.getElementById('lado')) calcularPerimetroCuadrado();
            else if (document.getElementById('base')) calcularPerimetroTriangulo();
        });
    }

});