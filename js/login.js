// Funciones para login.html

// aUsuarios de ejemplo para desarrollo
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
    
    
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

function autenticarUsuario(username, password, selectedRole) {
    
    mostrarCargando(true);
    
    setTimeout(() => {
        const usuario = usuarios[username.toLowerCase()];
        
        if (usuario && usuario.password === password && usuario.role === selectedRole) {
           
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


function verificarSesionActiva() {
    
}


document.addEventListener('DOMContentLoaded', function() {
    
});