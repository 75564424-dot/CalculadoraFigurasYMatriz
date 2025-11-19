async function eliminarUsuario() {
    const email = document.getElementById("email").value;

    if (!email) {
        mostrarMensaje("Por favor, ingresa un email", "error");
        return;
    }

    try {
        mostrarMensaje("Eliminando usuario...", "info");

        const response = await fetch("http://localhost:5000/api/eliminar-cuenta", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje("Usuario eliminado correctamente", "success");
            document.getElementById("email").value = "";
        } else {
            mostrarMensaje("Error: " + data.error, "error");
        }

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        mostrarMensaje("Error de conexión con el servidor", "error");
    }
}
