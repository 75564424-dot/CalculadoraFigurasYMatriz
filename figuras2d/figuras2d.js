// ============================================================
// 🧮 FIGURAS 2D - Cálculos de Área y Perímetro
// ------------------------------------------------------------
// Controla las interacciones y cálculos del módulo Figuras 2D:
// - Navegación entre figuras
// - Cálculo de área y perímetro (Círculo, Cuadrado, Triángulo)
// - Registro de historial local y en API
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 👤 Usuario Actual
    // ----------------------------
    // Recupera los datos del usuario logeado.
    // ============================
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // ============================
    // 💬 Mostrar Mensajes
    // ----------------------------
    // Muestra mensajes informativos o de error en pantalla.
    // ============================
    function mostrarMensaje(texto, tipo = "info") {
        const mensajeDiv = document.getElementById('mensaje');
        if (!mensajeDiv) return;
        mensajeDiv.textContent = texto;
        mensajeDiv.classList.toggle('error', tipo === "error");
    }

    // ============================
    // 🧭 Navegación desde Tarjetas
    // ----------------------------
    // Permite navegar al hacer clic en las tarjetas del menú.
    // Guarda el historial si hay usuario logeado.
    // ============================
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', () => {
            const calculo = tarjeta.dataset.calculo;
            const href = tarjeta.dataset.href;

            if (usuarioActual && calculo) {
                guardarHistorialGlobal("Figuras 2D", calculo);
                enviarHistorialAPI(calculo);
            }

            if (href) window.location.href = href;
        });
    });

    // ============================
    // 🧾 Referencias Comunes
    // ----------------------------
    // Contenedor de resultados para mostrar cálculos.
    // ============================
    const resultadoDiv = document.getElementById('resultado');

    // ============================================================
    // 🔹 FUNCIONES DE CÁLCULO
    // ============================================================

    // ---- Círculo ----
    function calcularAreaCirculo() {
        const radio = document.getElementById('radio')?.value.trim();
        if (!validarNumero(radio)) {
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
        }

        const r = parseFloat(radio);
        const area = Math.PI * r * r;

        resultadoDiv.innerHTML = `
            <h3>Área del Círculo</h3>
            <p>Fórmula: A = π × r²</p>
            <ul>
                <li>Radio: ${r}</li>
                <li>Área = ${area.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Círculo");
        enviarHistorialAPI("Área Círculo");
    }

    function calcularPerimetroCirculo() {
        const radio = document.getElementById('radio')?.value.trim();
        if (!validarNumero(radio)) {
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el radio.', 'error');
        }

        const r = parseFloat(radio);
        const perimetro = 2 * Math.PI * r;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Círculo</h3>
            <p>Fórmula: P = 2 × π × r</p>
            <ul>
                <li>Radio: ${r}</li>
                <li>Perímetro = ${perimetro.toFixed(2)}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Círculo");
        enviarHistorialAPI("Perímetro Círculo");
    }

    const inputRadio = document.getElementById('radio');
    const valorMostrado = document.getElementById('valorMostrado');

    if (inputRadio && valorMostrado) {
        inputRadio.addEventListener('input', () => {
            const valor = inputRadio.value.trim();
            valorMostrado.textContent = valor ? `r: ${valor}` : '';
        });
    }


    // ---- Cuadrado ----
    function calcularAreaCuadrado() {
        const lado = document.getElementById('lado')?.value.trim();
        if (!validarNumero(lado)) {
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
        }

        const l = parseFloat(lado);
        const area = l * l;

        resultadoDiv.innerHTML = `
            <h3>Área del Cuadrado</h3>
            <p>Fórmula: A = lado²</p>
            <ul>
                <li>Lado: ${l}</li>
                <li>Área = ${area}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Cuadrado");
        enviarHistorialAPI("Área Cuadrado");
    }

    function calcularPerimetroCuadrado() {
        const lado = document.getElementById('lado')?.value.trim();
        if (!validarNumero(lado)) {
            return mostrarMensaje('⚠️ Ingresa un número válido y mayor que 0 para el lado.', 'error');
        }

        const l = parseFloat(lado);
        const perimetro = 4 * l;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Cuadrado</h3>
            <p>Fórmula: P = 4 × lado</p>
            <ul>
                <li>Lado: ${l}</li>
                <li>Perímetro = ${perimetro}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Cuadrado");
        enviarHistorialAPI("Perímetro Cuadrado");
    }

    // ---- Mostrar L: valor en el centro del cuadrado ----
    const inputLado = document.getElementById('lado');
const valorLadoMostrado = document.getElementById('valorLadoMostrado');

if (inputLado && valorLadoMostrado) {
    inputLado.addEventListener('input', () => {
        const valor = inputLado.value.trim();
        valorLadoMostrado.textContent = valor ? `L: ${valor}` : '';
    });
}

    // ---- Triángulo ----
    function calcularAreaTriangulo() {
        const base = document.getElementById('base')?.value.trim();
        const altura = document.getElementById('altura')?.value.trim();
        if (!validarNumero(base) || !validarNumero(altura)) {
            return mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para base y altura.', 'error');
        }

        const b = parseFloat(base);
        const h = parseFloat(altura);
        const area = (b * h) / 2;

        resultadoDiv.innerHTML = `
            <h3>Área del Triángulo</h3>
            <p>Fórmula: A = (base × altura) / 2</p>
            <ul>
                <li>Base: ${b}</li>
                <li>Altura: ${h}</li>
                <li>Área = ${area}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Área Triángulo");
        enviarHistorialAPI("Área Triángulo");
    }

    function calcularPerimetroTriangulo() {
        const base = document.getElementById('base')?.value.trim();
        const lado1 = document.getElementById('lado1')?.value.trim();
        const lado2 = document.getElementById('lado2')?.value.trim();
        if (!validarNumero(base) || !validarNumero(lado1) || !validarNumero(lado2)) {
            return mostrarMensaje('⚠️ Ingresa valores válidos y mayores que 0 para todos los lados.', 'error');
        }

        const b = parseFloat(base);
        const l1 = parseFloat(lado1);
        const l2 = parseFloat(lado2);
        const perimetro = b + l1 + l2;

        resultadoDiv.innerHTML = `
            <h3>Perímetro del Triángulo</h3>
            <p>Fórmula: P = base + lado1 + lado2</p>
            <ul>
                <li>Lados: ${b}, ${l1}, ${l2}</li>
                <li>Perímetro = ${perimetro}</li>
            </ul>
        `;

        mostrarMensaje('✅ Cálculo realizado correctamente.');
        guardarHistorialGlobal("Figuras 2D", "Perímetro Triángulo");
        enviarHistorialAPI("Perímetro Triángulo");
    }

    // ---- Mostrar Base (b) y Altura (h) en el centro del triángulo ----
    const inputBase = document.getElementById('base');
    const inputAltura = document.getElementById('altura');
    const valorBaseMostrada = document.getElementById('valorBaseMostrada');
    const valorAlturaMostrada = document.getElementById('valorAlturaMostrada');

    // Mostrar base en tiempo real
    if (inputBase && valorBaseMostrada) {
        inputBase.addEventListener('input', () => {
            const valor = inputBase.value.trim();
            valorBaseMostrada.textContent = valor ? `b: ${valor}` : '';
        });
    }

    // Mostrar altura en tiempo real
    if (inputAltura && valorAlturaMostrada) {
        inputAltura.addEventListener('input', () => {
            const valor = inputAltura.value.trim();
            valorAlturaMostrada.textContent = valor ? `h: ${valor}` : '';
        });
    }

    // ============================
    // 🧮 Botones de Cálculo
    // ----------------------------
    // Detecta la figura activa y ejecuta la función correspondiente.
    // ============================
    const calcularAreaBtn = document.getElementById('calcularArea');
    const calcularPerimetroBtn = document.getElementById('calcularPerimetro');

    calcularAreaBtn?.addEventListener('click', () => {
        if (document.getElementById('radio')) calcularAreaCirculo();
        else if (document.getElementById('lado')) calcularAreaCuadrado();
        else if (document.getElementById('base')) calcularAreaTriangulo();
    });

    calcularPerimetroBtn?.addEventListener('click', () => {
        if (document.getElementById('radio')) calcularPerimetroCirculo();
        else if (document.getElementById('lado')) calcularPerimetroCuadrado();
        else if (document.getElementById('base')) calcularPerimetroTriangulo();
    });
});