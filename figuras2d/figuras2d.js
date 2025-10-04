document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 🔹 Usuario actual
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // ============================
    // 🔹 Función para mostrar mensajes
    // ============================
    function mostrarMensaje(texto, tipo = "info") {
        const mensajeDiv = document.getElementById('mensaje');
        if (!mensajeDiv) return;
        mensajeDiv.textContent = texto;
        mensajeDiv.classList.remove('error');
        if (tipo === "error") mensajeDiv.classList.add('error');
    }

    // ============================
    // 🔹 Guardar historial en API
    // ============================
    async function enviarHistorialAPI(seccion, calculo) {
        if (!usuarioActual) return;

        const fechaHora = new Date().toLocaleString();
        const nuevaEntrada = { seccion, calculo, fechaHora };

        // Guardar en localStorage
        usuarioActual.historial = usuarioActual.historial || [];
        usuarioActual.historial.push(nuevaEntrada);
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));

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
    // 🔹 Funciones de cálculo 2D
    // ============================

    // ---- Círculo ----
    function calcularAreaCirculo() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) {
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
            return;
        }

        const r = parseFloat(radio);
        const area = Math.PI * r * r;

        resultadoDiv.innerHTML = `
            <h3>Área del Círculo</h3>
            <p>Fórmula: A = π × r²</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Área = ${area.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Círculo");
        enviarHistorialAPI("Figuras 2D", "Área Círculo");
    }

    function calcularPerimetroCirculo() {
        const radio = document.getElementById('radio').value.trim();
        if (!validarNumero(radio)) {
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
            return;
        }

        const r = parseFloat(radio);
        const perimetro = 2 * Math.PI * r;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Círculo</h3>
            <p>Fórmula: P = 2 × π × r</p>
            <ul>
                <li>Radio ingresado: ${r}</li>
                <li>Perímetro = ${perimetro.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Círculo");
        enviarHistorialAPI("Figuras 2D", "Perímetro Círculo");
    }

    // ---- Cuadrado ----
    function calcularAreaCuadrado() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) {
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
            return;
        }

        const l = parseFloat(lado);
        const area = l * l;

        resultadoDiv.innerHTML = `
            <h3>Área del Cuadrado</h3>
            <p>Fórmula: A = lado²</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Área = ${area}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Cuadrado");
        enviarHistorialAPI("Figuras 2D", "Área Cuadrado");
    }

    function calcularPerimetroCuadrado() {
        const lado = document.getElementById('lado').value.trim();
        if (!validarNumero(lado)) {
            mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
            return;
        }

        const l = parseFloat(lado);
        const perimetro = 4 * l;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Cuadrado</h3>
            <p>Fórmula: P = 4 × lado</p>
            <ul>
                <li>Lado ingresado: ${l}</li>
                <li>Perímetro = ${perimetro}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Cuadrado");
        enviarHistorialAPI("Figuras 2D", "Perímetro Cuadrado");
    }

    // ---- Triángulo ----
    function calcularAreaTriangulo() {
        const base = document.getElementById('base').value.trim();
        const altura = document.getElementById('altura').value.trim();
        if (!validarNumero(base) || !validarNumero(altura)) {
            mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para base y altura.', 'error');
            return;
        }

        const b = parseFloat(base);
        const h = parseFloat(altura);
        const area = (b * h) / 2;

        resultadoDiv.innerHTML = `
            <h3>Área del Triángulo</h3>
            <p>Fórmula: A = (base × altura) / 2</p>
            <ul>
                <li>Base ingresada: ${b}</li>
                <li>Altura ingresada: ${h}</li>
                <li>Área = ${area}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Triángulo");
        enviarHistorialAPI("Figuras 2D", "Área Triángulo");
    }

    function calcularPerimetroTriangulo() {
        const base = document.getElementById('base').value.trim();
        const lado1 = document.getElementById('lado1').value.trim();
        const lado2 = document.getElementById('lado2').value.trim();
        if (!validarNumero(base) || !validarNumero(lado1) || !validarNumero(lado2)) {
            mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para todos los lados.', 'error');
            return;
        }

        const b = parseFloat(base);
        const l1 = parseFloat(lado1);
        const l2 = parseFloat(lado2);
        const perimetro = b + l1 + l2;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Triángulo</h3>
            <p>Fórmula: P = base + lado1 + lado2</p>
            <ul>
                <li>Lados ingresados: ${b}, ${l1}, ${l2}</li>
                <li>Perímetro = ${perimetro}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Triángulo");
        enviarHistorialAPI("Figuras 2D", "Perímetro Triángulo");
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