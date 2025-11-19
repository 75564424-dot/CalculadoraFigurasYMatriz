let emailActual = null; // email del usuario cargado

// ====================================
// CARGAR DATOS DEL USUARIO
// ====================================
async function cargarUsuarioParaEditar() {
    const emailBuscar = document.getElementById("emailBuscar").value.trim();

    if (!emailBuscar) {
        mostrarMensaje("Debes ingresar un email para buscar.", "error");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${emailBuscar}`);
        const data = await res.json();

        if (!data.success) {
            mostrarMensaje("Usuario no encontrado.", "error");
            return;
        }

        // Guardamos email para actualizar
        emailActual = data.usuario.email;

        // Cargar campos
        document.getElementById("nombre").value = data.usuario.nombre;
        document.getElementById("email").value = data.usuario.email;
        document.getElementById("rol").value = data.usuario.rol;

        // Tema
        const temaRadios = document.querySelectorAll("input[name='tema']");
        temaRadios.forEach(r => {
            r.checked = r.value === data.usuario.tema_preferido;
            r.disabled = false;
        });

        // Habilitar campos editables
        document.getElementById("nombre").disabled = false;
        document.getElementById("rol").disabled = false;

        mostrarMensaje("Datos cargados correctamente.", "success");

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

// ====================================
// ACTUALIZAR USUARIO
// ====================================
async function actualizarUsuario() {
    if (!emailActual) {
        mostrarMensaje("Primero debes cargar un usuario.", "error");
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const tema = document.querySelector("input[name='tema']:checked").value;
    const rol = document.getElementById("rol").value;

    if (!nombre) {
        mostrarMensaje("El nombre no puede estar vacío.", "error");
        return;
    }

    try {
        mostrarMensaje("Actualizando usuario...", "info");

        const res = await fetch(`http://localhost:5000/api/usuarios/${emailActual}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                tema_preferido: tema,
                rol
            })
        });

        const data = await res.json();

        if (data.success) {
            mostrarMensaje("Usuario actualizado correctamente.", "success");

            setTimeout(() => {
                window.location.href = "CRUD.html";
            }, 1500);

        } else {
            mostrarMensaje("Error: " + data.error, "error");
        }

    } catch (error) {
        console.error(error);
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}
