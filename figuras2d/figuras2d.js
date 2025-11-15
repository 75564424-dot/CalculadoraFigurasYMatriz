// ======================================================
// 🔹 INICIALIZACIÓN FIGURAS 2D
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Figuras 2D inicializadas');
    
    // Inicializar modo
    const modo = localStorage.getItem('modo') || 'claro';
    document.body.className = modo === 'oscuro' ? 'modo-oscuro' : 'light-mode';
});