document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Usuario actual
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // ============================
    // 🔹 Función para mostrar mensajes en la tarjeta
    // ============================
    function mostrarMensaje(texto, tipo = "info") {
        const mensajeDiv = document.getElementById('mensaje');
        if (!mensajeDiv) return;
        mensajeDiv.textContent = texto;

        // Limpiar clases anteriores
        mensajeDiv.classList.remove('error');
        if (tipo === "error") {
            mensajeDiv.classList.add('error');
        }
    }

    // ============================
    // 🔹 Guardar historial en API
    // ============================
    async function enviarHistorialAPI(seccion, calculo) {
        if (!usuarioActual) return;

        const fechaHora = new Date().toLocaleString();
        const nuevaEntrada = { seccion, calculo, fechaHora };

        // Guardar en el historial local del usuario
        usuarioActual.historial = usuarioActual.historial || [];
        usuarioActual.historial.push(nuevaEntrada);
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

        // Intentar enviar al servidor
        try {
            await fetch(`http://127.0.0.1:5000/perfiles/${usuarioActual.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ historial: usuarioActual.historial })
            });
        } catch (err) {
            console.error('Error al actualizar historial en API:', err);
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

            if (usuarioActual && calculo) {
                // Guardar historial global y API
                guardarHistorialGlobal("Figuras 3D", calculo);
                enviarHistorialAPI("Figuras 3D", calculo);
            }

            if (href) window.location.href = href;
        });
    });

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
        if (!validarNumero(radio)) { 
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
            return; 
        }

        const r = parseFloat(radio);
        const volumen = (4/3) * Math.PI * r**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen de la Esfera</h3>
            <p>Fórmula: V = (4/3) × π × r³</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Volumen = ${volumen.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Volumen Esfera");
        enviarHistorialAPI("Figuras 3D", "Volumen Esfera");
    }

    function calcularAreaEsfera() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) { 
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
            return; 
        }

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

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Área Esfera");
        enviarHistorialAPI("Figuras 3D", "Área Esfera");
    }

    // ---- Cubo ----
    function calcularVolumenCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { 
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
            return; 
        }

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

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Volumen Cubo");
        enviarHistorialAPI("Figuras 3D", "Volumen Cubo");
    }

    function calcularAreaCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) { 
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
            return; 
        }

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

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Área Cubo");
        enviarHistorialAPI("Figuras 3D", "Área Cubo");
    }

    // ---- Cilindro ----
    function calcularVolumenCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { 
            mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para radio y altura.', 'error');
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

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Volumen Cilindro");
        enviarHistorialAPI("Figuras 3D", "Volumen Cilindro");
    }

    function calcularAreaCilindro() {
        const radio = document.getElementById('radio').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(radio) || !validarNumero(altura)) { 
            mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para radio y altura.', 'error');
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

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Área Cilindro");
        enviarHistorialAPI("Figuras 3D", "Área Cilindro");
    }

    // ============================
    // 🔹 Botones de cálculo
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

    // ============================
    // 🔹 Actualizar texto sobre la imagen
    // ============================
    const inputRadio = document.getElementById('radio');
    const spanRadio = document.getElementById('valorRadio');

    if (inputRadio && spanRadio) {
        inputRadio.addEventListener('input', () => {
            const valor = inputRadio.value.trim();
            spanRadio.textContent = valor;
        });
    }

});