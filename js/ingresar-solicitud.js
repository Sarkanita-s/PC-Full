// Funciones para ingresar-solicitud.html

document.addEventListener('DOMContentLoaded', function() {
    // verificarAutenticacion(); // Comentado para permitir acceso libre
    initializeSolicitudForm();
    cargarBorradorSiExiste();
});

function verificarAutenticacion() {
    // Función deshabilitada para permitir acceso libre a la página
    /*
    const usuarioLogueado = localStorage.getItem('usuario_logueado');
    
    if (!usuarioLogueado) {
        alert('Acceso no autorizado. Redirigiendo al login...');
        window.location.href = 'login.html';
        return;
    }
    
    const userData = JSON.parse(usuarioLogueado);
    
    if (userData.role !== 'ventas') {
        alert('No tienes permisos para acceder a esta sección.');
        window.location.href = 'login.html';
        return;
    }
    */
}

function initializeSolicitudForm() {
    const form = document.getElementById('solicitudForm');
    
    // Configurar fecha mínima para entrega (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaEntrega').min = hoy;
    
    // Formatear RUT mientras se escribe
    document.getElementById('clienteRut').addEventListener('input', function(e) {
        formatearRUT(e.target);
    });
    
    // Formatear teléfono
    document.getElementById('clienteTelefono').addEventListener('input', function(e) {
        formatearTelefono(e.target);
    });
    
    // Lógica para mostrar/ocultar y habilitar/deshabilitar el campo de abono
    const abonoCheckbox = document.getElementById('abono');
    const abonoCantidadGroup = document.getElementById('abonoCantidadGroup');
    const abonoCantidadInput = document.getElementById('abonoCantidad');
    abonoCheckbox.addEventListener('change', function() {
        if (abonoCheckbox.checked) {
            abonoCantidadGroup.style.display = '';
            abonoCantidadInput.disabled = false;
            abonoCantidadInput.focus();
        } else {
            abonoCantidadGroup.style.display = 'none';
            abonoCantidadInput.value = '';
            abonoCantidadInput.disabled = true;
        }
    });

    // Submisión del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarSolicitud();
    });

    // Auto-guardar cada 2 minutos
    setInterval(guardarBorradorAuto, 120000);
}

function formatearRUT(input) {
    let valor = input.value.replace(/[^0-9kK]/g, '');
    if (valor.length > 1) {
        valor = valor.slice(0, -1) + '-' + valor.slice(-1);
    }
    input.value = valor.toUpperCase();
}

function formatearTelefono(input) {
    let valor = input.value.replace(/[^0-9+]/g, '');
    if (valor.length > 0 && !valor.startsWith('+')) {
        valor = '+56 ' + valor;
    }
    input.value = valor;
}

function procesarSolicitud() {
    if (!validarFormulario()) {
        return;
    }
    
    const formData = obtenerDatosFormulario();
    const numeroOrden = generarNumeroOrden();
    
    // Simular guardado en base de datos
    guardarSolicitud(formData, numeroOrden);
    
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(numeroOrden);
    
    // Limpiar borrador
    localStorage.removeItem('solicitud_borrador');
}

function validarFormulario() {
    const campos = [
        'clienteNombre', 'clienteRut', 'clienteTelefono',
        'equipoTipo', 'equipoMarca', 'tipoServicio', 
        'prioridad', 'problemaDescripcion'
    ];
    
    for (let campo of campos) {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
            alert(`El campo "${elemento.previousElementSibling.textContent}" es obligatorio.`);
            elemento.focus();
            return false;
        }
    }
    // Si abono está seleccionado, validar que el monto no esté vacío ni sea negativo
    const abonoCheckbox = document.getElementById('abono');
    const abonoCantidadInput = document.getElementById('abonoCantidad');
    if (abonoCheckbox.checked) {
        if (!abonoCantidadInput.value.trim() || Number(abonoCantidadInput.value) < 0) {
            alert('Debe ingresar un monto válido para el abono inicial.');
            abonoCantidadInput.focus();
            return false;
        }
    }
    
    // Validar formato de RUT
    const rut = document.getElementById('clienteRut').value;
    if (!validarRUT(rut)) {
        alert('El formato del RUT no es válido.');
        document.getElementById('clienteRut').focus();
        return false;
    }
    
    return true;
}

function validarRUT(rut) {
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    return rutRegex.test(rut);
}

function obtenerDatosFormulario() {
    return {
        cliente: {
            nombre: document.getElementById('clienteNombre').value.trim(),
            rut: document.getElementById('clienteRut').value.trim(),
            telefono: document.getElementById('clienteTelefono').value.trim(),
            email: document.getElementById('clienteEmail').value.trim(),
            direccion: document.getElementById('clienteDireccion').value.trim()
        },
        equipo: {
            tipo: document.getElementById('equipoTipo').value,
            marca: document.getElementById('equipoMarca').value.trim(),
            modelo: document.getElementById('equipoModelo').value.trim(),
            serial: document.getElementById('equipoSerial').value.trim(),
            accesorios: document.getElementById('equipoAccesorios').value.trim()
        },
        servicio: {
            tipo: document.getElementById('tipoServicio').value,
            prioridad: document.getElementById('prioridad').value,
            descripcion: document.getElementById('problemaDescripcion').value.trim(),
            sintomas: document.getElementById('sintomas').value.trim(),
            fechaEntrega: document.getElementById('fechaEntrega').value,
            costoEstimado: document.getElementById('costoEstimado').value,
            observaciones: document.getElementById('observaciones').value.trim(),
            garantia: document.getElementById('garantia').checked
        },
        fechaCreacion: new Date().toISOString(),
        usuario: JSON.parse(localStorage.getItem('usuario_logueado')).username
    };
}

function generarNumeroOrden() {
    const año = new Date().getFullYear();
    const numero = String(Date.now()).slice(-3);
    return `ORD-${año}-${numero}`;
}

function guardarSolicitud(datos, numeroOrden) {
    // Simular guardado en base de datos
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    
    datos.numeroOrden = numeroOrden;
    datos.estado = 'recibido';
    
    solicitudes.push(datos);
    localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudes));
    
    console.log('Solicitud guardada:', datos);
}

function mostrarModalConfirmacion(numeroOrden) {
    document.getElementById('numeroOrdenGenerado').textContent = numeroOrden;
    document.getElementById('modalConfirmacion').style.display = 'flex';
}

function guardarBorrador() {
    const datos = obtenerDatosFormulario();
    localStorage.setItem('solicitud_borrador', JSON.stringify(datos));
    alert('Borrador guardado exitosamente.');
}

function guardarBorradorAuto() {
    // Solo guardar si hay datos en el formulario
    const nombre = document.getElementById('clienteNombre').value.trim();
    if (nombre) {
        const datos = obtenerDatosFormulario();
        localStorage.setItem('solicitud_borrador', JSON.stringify(datos));
        console.log('Borrador guardado automáticamente');
    }
}

function cargarBorradorSiExiste() {
    const borrador = localStorage.getItem('solicitud_borrador');
    if (borrador) {
        if (confirm('Se encontró un borrador guardado. ¿Deseas cargarlo?')) {
            cargarBorrador(JSON.parse(borrador));
        }
    }
}

function cargarBorrador(datos) {
    // Cargar datos del cliente
    document.getElementById('clienteNombre').value = datos.cliente.nombre || '';
    document.getElementById('clienteRut').value = datos.cliente.rut || '';
    document.getElementById('clienteTelefono').value = datos.cliente.telefono || '';
    document.getElementById('clienteEmail').value = datos.cliente.email || '';
    document.getElementById('clienteDireccion').value = datos.cliente.direccion || '';
    
    // Cargar datos del equipo
    document.getElementById('equipoTipo').value = datos.equipo.tipo || '';
    document.getElementById('equipoMarca').value = datos.equipo.marca || '';
    document.getElementById('equipoModelo').value = datos.equipo.modelo || '';
    document.getElementById('equipoSerial').value = datos.equipo.serial || '';
    document.getElementById('equipoAccesorios').value = datos.equipo.accesorios || '';
    
    // Cargar datos del servicio
    document.getElementById('tipoServicio').value = datos.servicio.tipo || '';
    document.getElementById('prioridad').value = datos.servicio.prioridad || '';
    document.getElementById('problemaDescripcion').value = datos.servicio.descripcion || '';
    document.getElementById('sintomas').value = datos.servicio.sintomas || '';
    document.getElementById('fechaEntrega').value = datos.servicio.fechaEntrega || '';
    document.getElementById('costoEstimado').value = datos.servicio.costoEstimado || '';
    document.getElementById('observaciones').value = datos.servicio.observaciones || '';
    document.getElementById('garantia').checked = datos.servicio.garantia || false;
}

function limpiarFormulario() {
    if (confirm('¿Estás seguro que deseas limpiar todo el formulario?')) {
        document.getElementById('solicitudForm').reset();
        localStorage.removeItem('solicitud_borrador');
    }
}

function imprimirSolicitud() {
    const numeroOrden = document.getElementById('numeroOrdenGenerado').textContent;
    alert(`Imprimiendo solicitud ${numeroOrden}...\n(Función de impresión pendiente de implementar)`);
}

function nuevaSolicitud() {
    document.getElementById('modalConfirmacion').style.display = 'none';
    document.getElementById('solicitudForm').reset();
    localStorage.removeItem('solicitud_borrador');
    document.getElementById('clienteNombre').focus();
}

function volverMenu() {
    window.location.href = 'menu-ventas.html';
}