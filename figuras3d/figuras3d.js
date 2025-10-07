// ============================
// 📦 figuras3d.js
// ============================
// Gestiona los cálculos de volumen y área para figuras 3D
// Compatible con el sistema global de historial y validación
// ============================

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 👤 Usuario actual
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // ============================
    // 💬 Mostrar mensajes en pantalla
    // ============================
    function mostrarMensaje(texto, tipo = "info") {
        const mensajeDiv = document.getElementById('mensaje');
        if (!mensajeDiv) return;

        mensajeDiv.textContent = texto;
        mensajeDiv.classList.remove('error');
        if (tipo === "error") mensajeDiv.classList.add('error');
    }

    // ============================
    // 🧭 Navegación desde tarjetas (selección de figura)
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const calculo = tarjeta.dataset.calculo;
            const href = tarjeta.dataset.href;

            if (usuarioActual && calculo) {
                guardarHistorialGlobal("Figuras 3D", calculo);
                enviarHistorialAPI("Figuras 3D", calculo);
            }
            if (href) window.location.href = href;
        });
    });

    // ============================
    // 🧮 Referencias de salida y validación
    // ============================
    const resultadoDiv = document.getElementById('resultado');
    if (!resultadoDiv) return;

    // ============================
    // 📏 Funciones de cálculo (3D)
    // ============================

    // ---- Esfera ----
    function calcularVolumenEsfera() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) 
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');

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
        if (!validarNumero(radio)) 
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');

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
        if (!validarNumero(lado)) 
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');

        const l = parseFloat(lado);
        const volumen = l**3;

        resultadoDiv.innerHTML = `
            <h3>Volumen del Cubo</h3>
            <p>Fórmula: V = lado³</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Volumen = ${volumen.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 3D", "Volumen Cubo");
        enviarHistorialAPI("Figuras 3D", "Volumen Cubo");
    }

    function calcularAreaCubo() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) 
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');

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
        if (!validarNumero(radio) || !validarNumero(altura))
            return mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para radio y altura.', 'error');

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
        if (!validarNumero(radio) || !validarNumero(altura))
            return mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para radio y altura.', 'error');

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
    // 🎯 Botones de cálculo
    // ============================
    const calcularAreaBtn = document.getElementById('calcularArea');
    const calcularVolumenBtn = document.getElementById('calcularVolumen');

    calcularAreaBtn?.addEventListener('click', () => {
        if (document.getElementById('radio') && document.getElementById('altura')) return calcularAreaCilindro();
        if (document.getElementById('radio')) return calcularAreaEsfera();
        if (document.getElementById('lado')) return calcularAreaCubo();
    });

    calcularVolumenBtn?.addEventListener('click', () => {
        if (document.getElementById('radio') && document.getElementById('altura')) return calcularVolumenCilindro();
        if (document.getElementById('radio')) return calcularVolumenEsfera();
        if (document.getElementById('lado')) return calcularVolumenCubo();
    });

    // ============================
    // ✏️ Actualizar texto en imagen (inputs dinámicos)
    // ============================
    const inputRadio = document.getElementById('radio');
    const spanRadio = document.getElementById('valorRadio');

    inputRadio?.addEventListener('input', () => {
        spanRadio.textContent = inputRadio.value.trim();
    });
});