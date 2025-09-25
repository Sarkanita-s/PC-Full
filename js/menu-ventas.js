// Faunciones para menu-ventas.html

document.addEventListener('DOMContentLoaded', function() {
    // verificarAutenticacion(); // Comentado para permitir acceso libre
    initializeMenuVentas();
    cargarDashboardStats();
});

function verificarAutenticacion() {
    
    const usuarioLogueado = localStorage.getItem('usuario_logueado');
    if (usuarioLogueado) {
        const userData = JSON.parse(usuarioLogueado);
        const usuarioElement = document.getElementById('usuarioActual');
        if (usuarioElement) {
            usuarioElement.textContent = userData.username;
        }
    } else {
        const usuarioElement = document.getElementById('usuarioActual');
        if (usuarioElement) {
            usuarioElement.textContent = 'Usuario Demo';
        }
    }
}

function initializeMenuVentas() {
    // Mostrar fecha actual
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('fechaActual').textContent = fecha;
}

function cargarDashboardStats() {
    // Simular carga de estadísticas desde el servidor
    setTimeout(() => {
        document.getElementById('solicitudesPendientes').textContent = '12';
        document.getElementById('repuestosCriticos').textContent = '3';
        document.getElementById('ordenesHoy').textContent = '5';
    }, 1000);
}

// Funciones de navegación
function irAIngresarSolicitud() {
    window.location.href = 'ingresar-solicitud.html';
}

function irAHardware() {
    window.location.href = 'hardware-repuestos.html';
}

function mostrarProximamente(modulo) {
    alert(`El módulo "${modulo}" estará disponible próximamente.\n\nEstamos trabajando para implementar esta funcionalidad.`);
}

function cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario_logueado');
        alert('Sesión cerrada exitosamente.');
        window.location.href = 'login.html';
    }
}

function mostrarAyuda() {
    const ayuda = `
=== AYUDA DEL SISTEMA ===

🏠 MENÚ PRINCIPAL:
• Ingreso de Solicitudes: Registrar nuevos servicios
• Gestión de Hardware: Ver repuestos y compras
• Reportes: Estadísticas (próximamente)
• Clientes: Base de datos (próximamente)

📝 INGRESO DE SOLICITUDES:
• Completar datos del cliente
• Describir el problema del equipo
• Seleccionar tipo de servicio
• Generar número de orden

🔧 GESTIÓN DE HARDWARE:
• Ver repuestos disponibles
• Marcar repuestos como críticos
• Gestionar compras pendientes

⚠️ IMPORTANTE:
• Las sesiones expiran después de 8 horas
• Guardar cambios antes de salir
• Contactar al administrador ante problemas

📞 SOPORTE:
• Email: soporte@pcfull.com
• Teléfono: +56 9 XXXX XXXX
`;
    
    alert(ayuda);
}

// Función para actualizar estadísticas en tiempo real
function actualizarStats() {
    cargarDashboardStats();
}

// Actualizar estadísticas cada 5 minutos
setInterval(actualizarStats, 300000);