async function crearUsuario() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tema = document.querySelector('input[name="tema"]:checked').value;
    const rol = document.getElementById('rol').value;

    if (!nombre || !email || !password) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return;
    }

    try {
        // Mostrar mensaje de carga
        mostrarMensaje('Creando usuario...', 'info');

        const response = await fetch('http://localhost:5000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password,
                tema_preferido: tema,
                rol: rol,
            })
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Usuario creado exitosamente', 'success');
            window.location.href = 'CRUD.html'; // Redirigir a la página de administración
        } else {
            mostrarMensaje('Error: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}