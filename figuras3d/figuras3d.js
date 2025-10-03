document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Usuario actual
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // ============================
    // 🔹 Botones para volver
    // ============================
    const volverBtn = document.getElementById('volverBtn');
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    const volverFigurasBtn = document.getElementById('volverFiguras');
    if (volverFigurasBtn) {
        volverFigurasBtn.addEventListener('click', () => {
            window.location.href = 'figuras3d.html';
        });
    }

    // ============================
    // 🔹 Historial
    // ============================
    const historialBtn = document.getElementById('historialBtn');
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
    // 🔹 Guardar historial solo al entrar desde tarjeta
    // ============================
    async function guardarHistorial(calculo) {
        if (!calculo) return;
    
        const fechaHora = new Date().toLocaleString(); // obtiene fecha y hora local
        const nuevaEntrada = { calculo, fecha: fechaHora };
    
        // Si hay usuario logeado, seguimos guardando en localStorage
        if (usuarioActual) {
            usuarioActual.historial = usuarioActual.historial || [];
            usuarioActual.historial.push(nuevaEntrada);
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
            try {
                await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ historial: usuarioActual.historial })
                });
            } catch(err) {
                console.error('Error al actualizar historial en API:', err);
            }
        } else {
            // Si no hay usuario, podemos guardar igual en una variable local o no guardar
            console.log('Historial temporal:', nuevaEntrada);
        }
    }
    
    // ============================
    // 🔹 Navegación desde tarjetas
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const calculo = tarjeta.dataset.calculo;
            const href = tarjeta.dataset.href;

            // Guardar historial solo si hay usuario logeado
            if (usuarioActual && calculo) {
                guardarHistorial(calculo);
            }

            // Redirigir siempre, aunque no haya usuario
            if (href) window.location.href = href;
        });
    });

    // ============================
    // 🔹 Validación de números positivos
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
        if (!validarNumero(radio)) { alert('Error: ingresa un número positivo mayor que 0'); return; }

        const r = parseFloat(radio);
        const volumen = (4/3) * Math.PI * r**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen de la Esfera</h3>
            <p>Fórmula: V = 4/3 × π × r³</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Volumen = ${volumen.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularAreaEsfera() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { alert('Error: ingresa un número positivo mayor que 0'); return; }

        const r = parseFloat(radio);
        const area = 4 * Math.PI * r**2;

        resultadoDiv.innerHTML = `
            <h3>Área Superficial de la Esfera</h3>
            <p>Fórmula: A = 4 × π × r²</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Área superficial = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    // ---- Cubo ----
    function calcularVolumenCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error: ingresa un número positivo mayor que 0'); return; }

        const l = parseFloat(lado);
        const volumen = l**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen del Cubo</h3>
            <p>Fórmula: V = lado³</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Volumen = ${volumen}</li>
            </ul>
        `;
    }

    function calcularAreaCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { alert('Error: ingresa un número positivo mayor que 0'); return; }

        const l = parseFloat(lado);
        const area = 6 * l**2;

        resultadoDiv.innerHTML = `
            <h3>Área Superficial del Cubo</h3>
            <p>Fórmula: A = 6 × lado²</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Área superficial = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    // ---- Cilindro ----
    function calcularVolumenCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { 
            alert('Error: ingresa números positivos mayores que 0'); 
            return; 
        }

        const r = parseFloat(radio);
        const h = parseFloat(altura);
        const volumen = Math.PI * r**2 * h;

        resultadoDiv.innerHTML = `
            <h3>Volumen del Cilindro</h3>
            <p>Fórmula: V = π × r² × h</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Volumen = ${volumen.toFixed(2)}</li>
            </ul>
        `;
    }

    function calcularAreaCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { 
            alert('Error: ingresa números positivos mayores que 0'); 
            return; 
        }

        const r = parseFloat(radio);
        const h = parseFloat(altura);
        const area = 2 * Math.PI * r * (r + h);

        resultadoDiv.innerHTML = `
            <h3>Área Superficial del Cilindro</h3>
            <p>Fórmula: A = 2 × π × r × (r + h)</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Área superficial = ${area.toFixed(2)}</li>
            </ul>
        `;
    }

    // ============================
    // 🔹 Botones de cálculo (funcionan aunque no haya usuario)
    // ============================
    const calcularAreaBtn = document.getElementById('calcularArea');
    const calcularVolumenBtn = document.getElementById('calcularVolumen');

    if (calcularAreaBtn) {
        calcularAreaBtn.addEventListener('click', () => {
            if (document.getElementById('radio') && document.getElementById('altura')) {
                calcularAreaCilindro();
            } else if (document.getElementById('radio')) {
                calcularAreaEsfera();
            } else if (document.getElementById('lado')) {
                calcularAreaCubo();
            }
        });
    }

    if (calcularVolumenBtn) {
        calcularVolumenBtn.addEventListener('click', () => {
            if (document.getElementById('radio') && document.getElementById('altura')) {
                calcularVolumenCilindro();
            } else if (document.getElementById('radio')) {
                calcularVolumenEsfera();
            } else if (document.getElementById('lado')) {
                calcularVolumenCubo();
            }
        });
    }

    // Captura del input del radio
    const inputRadio = document.getElementById('radio');
    const spanRadio = document.getElementById('valorRadio');

    if (inputRadio && spanRadio) {
        inputRadio.addEventListener('input', () => {
            const valor = inputRadio.value.trim();
            spanRadio.textContent = valor; // actualiza el span sobre la imagen
        });
    }

});