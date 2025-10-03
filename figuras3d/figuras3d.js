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
    // 🔹 Guardar entrada en historial y navegación
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const calculo = tarjeta.dataset.calculo;
            const href = tarjeta.dataset.href;

            if (usuarioActual && calculo) {
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
        return !isNaN(num) && num > 0;
    }

    // ============================
    // 🔹 Referencia al div de resultados
    // ============================
    const resultadoDiv = document.getElementById('resultado');

    // ============================
    // 🔹 Funciones de cálculo 3D
    // ============================

    // ---- Esfera ----
    function calcularVolumenEsfera() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const volumen = (4/3) * Math.PI * r**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen de la Esfera</h3>
            <p>Fórmula: V = 4/3 × π × r³</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>4/3 × π × r³ = ${(4/3).toFixed(2)} × ${Math.PI.toFixed(2)} × ${r}³</li>
                <li>Volumen = ${volumen.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularAreaEsfera() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const area = 4 * Math.PI * r**2;

        resultadoDiv.innerHTML = `
            <h3>Área Superficial de la Esfera</h3>
            <p>Fórmula: A = 4 × π × r²</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>4 × π × r² = 4 × ${Math.PI.toFixed(2)} × ${r}²</li>
                <li>Área superficial = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    // ---- Cubo ----
    function calcularVolumenCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error al ingresar los datos'); return; }

        const l = parseFloat(lado);
        const volumen = l**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen del Cubo</h3>
            <p>Fórmula: V = lado³</p>
            <p>Pasos:</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Volumen = ${l}³ = ${volumen}</li>
            </ul>
        `;
    }

    function calcularAreaCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error al ingresar los datos'); return; }

        const l = parseFloat(lado);
        const area = 6 * l**2;

        resultadoDiv.innerHTML = `
            <h3>Área Superficial del Cubo</h3>
            <p>Fórmula: A = 6 × lado²</p>
            <p>Pasos:</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Área = 6 × ${l}² = ${area}</li>
            </ul>
        `;
    }

    // ---- Cilindro ----
    function calcularVolumenCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const h = parseFloat(altura);
        const volumen = Math.PI * r**2 * h;

        resultadoDiv.innerHTML = `
            <h3>Volumen del Cilindro</h3>
            <p>Fórmula: V = π × r² × h</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Volumen = π × ${r}² × ${h} = ${volumen.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularAreaCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { alert('Error al ingresar los datos'); return; }

        const r = parseFloat(radio);
        const h = parseFloat(altura);
        const area = 2 * Math.PI * r * (r + h);

        resultadoDiv.innerHTML = `
            <h3>Área Superficial del Cilindro</h3>
            <p>Fórmula: A = 2 × π × r × (r + h)</p>
            <p>Pasos:</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Área = 2 × π × ${r} × (${r} + ${h}) = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    // ============================
    // 🔹 Botones de cálculo
    // ============================
    const calcularAreaBtn = document.getElementById('calcularArea');
    const calcularVolumenBtn = document.getElementById('calcularVolumen');

    if (calcularAreaBtn) {
        calcularAreaBtn.addEventListener('click', () => {
            // ---- Cilindro ----
            if (document.getElementById('radio') && document.getElementById('altura')) {
                calcularAreaCilindro();
            }
            // ---- Esfera ----
            else if (document.getElementById('radio')) {
                calcularAreaEsfera();
            }
            // ---- Cubo ----
            else if (document.getElementById('lado')) {
                calcularAreaCubo();
            }
        });
    }

    if (calcularVolumenBtn) {
        calcularVolumenBtn.addEventListener('click', () => {
            // ---- Cilindro ----
            if (document.getElementById('radio') && document.getElementById('altura')) {
                calcularVolumenCilindro();
            }
            // ---- Esfera ----
            else if (document.getElementById('radio')) {
                calcularVolumenEsfera();
            }
            // ---- Cubo ----
            else if (document.getElementById('lado')) {
                calcularVolumenCubo();
            }
        });
    }

});
