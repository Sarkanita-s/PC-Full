// Funciones para login.html

// Usuarios de ejemplo para desarrollo
const usuarios = {
    'admin': { password: 'admin123', role: 'admin' },
    'ventas': { password: 'ventas123', role: 'ventas' },
    'vendedor1': { password: 'venta123', role: 'ventas' },
    'sofia': { password: 'sofia123', role: 'ventas' },
    'cliente': { password: 'cliente123', role: 'client' }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const selectedRole = document.getElementById('role').value;
        
        // Validar campos vacíos
        if (!username || !password || !selectedRole) {
            mostrarError('Por favor completa todos los campos');
            return;
        }
        
        // Simular proceso de autenticación
        autenticarUsuario(username, password, selectedRole);
    });
    
    // Agregar enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

function autenticarUsuario(username, password, selectedRole) {
    // Mostrar indicador de carga
    mostrarCargando(true);
    
    setTimeout(() => {
        const usuario = usuarios[username.toLowerCase()];
        
        if (usuario && usuario.password === password && usuario.role === selectedRole) {
            // Autenticación exitosa
            localStorage.setItem('usuario_logueado', JSON.stringify({
                username: username,
                role: selectedRole,
                loginTime: new Date().toISOString()
            }));
            
            mostrarCargando(false);
            mostrarExito('¡Acceso concedido! Redirigiendo...');
            
            // Redireccionar según el rol
            setTimeout(() => {
                switch(selectedRole) {
                    case 'admin':
                        window.location.href = 'admin.html';
                        break;
                    case 'ventas':
                        window.location.href = 'menu-ventas.html';
                        break;
                    case 'client':
                        window.location.href = 'client.html';
                        break;
                    default:
                        mostrarError('Tipo de usuario no válido');
                }
            }, 1500);
            
        } else {
            mostrarCargando(false);
            mostrarError('Usuario, contraseña o tipo de acceso incorrectos');
            limpiarFormulario();
        }
    }, 1000); // Simular tiempo de autenticación
}

function mostrarCargando(mostrar) {
    const boton = document.querySelector('.btn-login');
    const form = document.getElementById('loginForm');
    
    if (mostrar) {
        boton.textContent = 'Verificando credenciales...';
        boton.disabled = true;
        form.style.opacity = '0.7';
    } else {
        boton.textContent = 'Ingresar al Sistema';
        boton.disabled = false;
        form.style.opacity = '1';
    }
}

function mostrarError(mensaje) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.textContent = mensaje;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(alert, loginCard.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

function mostrarExito(mensaje) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = mensaje;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(alert, loginCard.firstChild);
}

function limpiarFormulario() {
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// Función para limpiar completamente la sesión
function limpiarSesionCompleta() {
    localStorage.removeItem('usuario_logueado');
    localStorage.removeItem('solicitud_borrador');
    localStorage.removeItem('solicitudes_guardadas');
    localStorage.removeItem('repuestos_data');
    localStorage.removeItem('compras_pendientes');
    console.log('Sesión y datos limpiados completamente');
}

// Verificar si el usuario ya está logueado
function verificarSesionActiva() {
    // Comentado para evitar bucles de redirección !!! CAMBIOS DE LUCES RAPIDOS ¡¡¡
    // Se puede activar más tarde si es necesario
    /*
    const usuarioLogueado = localStorage.getItem('usuario_logueado');
    if (usuarioLogueado) {
        const userData = JSON.parse(usuarioLogueado);
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        const horasTranscurridas = (now - loginTime) / (1000 * 60 * 60);
        
        // Si han pasado menos de 8 horas, mantener sesión activa
        if (horasTranscurridas < 8) {
            switch(userData.role) {
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                case 'ventas':
                    window.location.href = 'menu-ventas.html';
                    break;
                case 'client':
                    window.location.href = 'client.html';
                    break;
            }
        } else {
            // Sesión expirada
            localStorage.removeItem('usuario_logueado');
        }
    }
    */
}

// Verificar sesión al cargar la página (deshabilitado temporalmente)
document.addEventListener('DOMContentLoaded', function() {
    // verificarSesionActiva(); // Comentado para evitar bucles
});