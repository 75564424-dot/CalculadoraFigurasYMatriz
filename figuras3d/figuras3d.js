// ======================================================
// 🔹 INICIALIZACIÓN FIGURAS 3D
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Menu de Figuras 3D inicializado');
    
    // Inicializar modo (tema preferido)
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});