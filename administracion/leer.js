// =========================================
// CARGAR TODOS LOS USUARIOS AL ENTRAR
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    cargarTodosLosUsuarios();
});

function mostrarTabla() {
    document.getElementById("tablaUsuarios").style.display = "table";
}

function limpiarTabla() {
    document.getElementById("cuerpoTabla").innerHTML = "";
}

async function cargarTodosLosUsuarios() {
    try {
        mostrarMensaje("Cargando usuarios...", "info");

        const res = await fetch("http://localhost:5000/api/usuarios");
        const data = await res.json();

        if (!data.success || data.usuarios.length === 0) {
            mostrarMensaje("No hay usuarios registrados.", "error");
            return;
        }

        limpiarTabla();

        data.usuarios.forEach(u => {
            agregarFila(u);
        });

        mostrarMensaje("Usuarios cargados correctamente.", "success");
        mostrarTabla();

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

// =========================================
// BUSCAR POR EMAIL
// =========================================
async function buscarUsuario() {
    const email = document.getElementById("email").value.trim();

    if (!email) {
        cargarTodosLosUsuarios(); // si no hay email, mostrar todo
        return;
    }

    try {
        mostrarMensaje("Buscando usuario...", "info");

        const res = await fetch(`http://localhost:5000/api/usuarios/${email}`);
        const data = await res.json();

        if (!data.success) {
            mostrarMensaje("Usuario no encontrado.", "error");
            return;
        }

        limpiarTabla();
        agregarFila(data.usuario);
        mostrarMensaje("Usuario encontrado.", "success");
        mostrarTabla();

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

// =========================================
// AGREGAR UNA FILA A LA TABLA
// =========================================
function agregarFila(usuario) {
    const tbody = document.getElementById("cuerpoTabla");

    const fila = `
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tema_preferido}</td>
            <td>${usuario.rol}</td>
        </tr>
    `;

    tbody.innerHTML += fila;
}
