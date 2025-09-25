// --- Carrito de servicios ---
let carritoServicios = [];
const PRECIO_SERVICIO = 5000; // Precio fijo por servicio

document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    configurarEventos();
    mostrarFechaActual();
    inicializarFormulario();
});

function configurarEventos() {
    // Configurar evento del botón de agregar servicio
    const agregarServicioBtn = document.getElementById('agregarServicioBtn');
    if (agregarServicioBtn) {
        agregarServicioBtn.addEventListener('click', function() {
            const select = document.getElementById('tipoServicio');
            const nombre = select.options[select.selectedIndex].text;
            const valor = select.value;
            
            if (valor && !carritoServicios.includes(nombre)) {
                carritoServicios.push(nombre);
                renderizarCarritoServicios();
            }
        });
    }
    
    // Configurar el formulario
    const form = document.getElementById('solicitudForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarSolicitud();
        });
    }
}

function mostrarFechaActual() {
    // Mostrar la fecha actual en el campo de fecha de registro
    const fechaRegistroInput = document.getElementById('fechaRegistro');
    if (fechaRegistroInput) {
        const fechaActual = new Date();
        const opcionesFecha = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        fechaRegistroInput.value = fechaActual.toLocaleDateString('es-CL', opcionesFecha);
    }
}

function inicializarFormulario() {
    // Inicializar carrito vacío
    carritoServicios = [];
    renderizarCarritoServicios();
}

function renderizarCarritoServicios() {
    const ul = document.getElementById('carritoServicios');
    ul.innerHTML = '';
    
    if (carritoServicios.length === 0) {
        ul.innerHTML = '<li>No hay servicios seleccionados</li>';
        return;
    }
    
    carritoServicios.forEach((serv, idx) => {
        const li = document.createElement('li');
        li.textContent = `${serv} — $${PRECIO_SERVICIO.toLocaleString('es-CL')} CLP`;
        
        // Botón para eliminar servicio del carrito
        const btn = document.createElement('button');
        btn.textContent = '✖';
        btn.type = 'button';
        btn.style.marginLeft = '0.5em';
        btn.style.border = 'none';
        btn.style.background = 'none';
        btn.style.color = '#ff4444';
        btn.style.cursor = 'pointer';
        btn.onclick = function() {
            carritoServicios.splice(idx, 1);
            renderizarCarritoServicios();
        };
        
        li.appendChild(btn);
        ul.appendChild(li);
    });
    
    // Mostrar total
    let total = carritoServicios.length * PRECIO_SERVICIO;
    let totalDiv = document.getElementById('carritoTotalServicios');
    
    if (!totalDiv) {
        totalDiv = document.createElement('div');
        totalDiv.id = 'carritoTotalServicios';
        totalDiv.style.marginTop = '10px';
        totalDiv.style.fontWeight = 'bold';
        ul.parentElement.appendChild(totalDiv);
    }
    
    totalDiv.textContent = `Total: $${total.toLocaleString('es-CL')} CLP`;
}

// Alterna entre RUT y Pasaporte en el formulario de cliente
function alternarRutPasaporte() {
    const usarPasaporte = document.getElementById('usarPasaporte').checked;
    document.getElementById('rutCliente').disabled = usarPasaporte;
    document.getElementById('rutCliente').required = !usarPasaporte;
    document.getElementById('pasaporteCliente').disabled = !usarPasaporte;
    document.getElementById('pasaporteCliente').required = usarPasaporte;
    
    if (usarPasaporte) {
        document.getElementById('rutCliente').value = '';
    } else {
        document.getElementById('pasaporteCliente').value = '';
    }
}

function procesarSolicitud() {
    if (!validarFormulario()) {
        return;
    }
    
    // Generar número de orden autoincremental
    const numeroOrden = obtenerSiguienteNumeroOrden();
    
    // Preparar datos de la orden
    const datosOrden = {
        cliente: {
            nombre: document.getElementById('nombreCliente').value.trim(),
            rut: document.getElementById('rutCliente').disabled ? '' : document.getElementById('rutCliente').value.trim(),
            pasaporte: document.getElementById('pasaporteCliente').disabled ? '' : document.getElementById('pasaporteCliente').value.trim(),
            telefono: document.getElementById('telefonoCliente').value.trim(),
            correo: document.getElementById('correoCliente').value.trim(),
            comuna: document.getElementById('comunaCliente').value.trim(),
            domicilio: document.getElementById('domicilioCliente').value.trim()
        },
        equipo: {
            tipo: document.getElementById('tipoEquipo').value,
            marca: document.getElementById('marcaEquipo').value.trim(),
            modelo: document.getElementById('modeloEquipo').value.trim()
        },
        numeroOrden,
        servicios: [...carritoServicios],
        descripcion: document.getElementById('descripcionProblema').value.trim(),
        fecha: new Date().toISOString(),
        fechaRegistro: document.getElementById('fechaRegistro').value,
        estado: 'pendiente',
        origen: 'cliente_externo'
    };
    
    // Guardar la orden
    guardarOrden(datosOrden);
    
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(numeroOrden);
}

function validarFormulario() {
    const campos = [
        'nombreCliente', 'telefonoCliente', 'correoCliente',
        'tipoEquipo', 'marcaEquipo', 'descripcionProblema'
    ];
    
    // Verificar campos requeridos
    for (let campo of campos) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value.trim()) {
            alert(`El campo "${elemento?.previousElementSibling?.textContent || campo}" es obligatorio.`);
            if (elemento) elemento.focus();
            return false;
        }
    }
    
    // Validar RUT o Pasaporte según corresponda
    const usarPasaporte = document.getElementById('usarPasaporte').checked;
    if (usarPasaporte) {
        const pasaporte = document.getElementById('pasaporteCliente').value.trim();
        if (!pasaporte) {
            alert('Debe ingresar un número de pasaporte válido.');
            document.getElementById('pasaporteCliente').focus();
            return false;
        }
    } else {
        const rut = document.getElementById('rutCliente').value.trim();
        if (!validarRUT(rut)) {
            alert('El formato del RUT no es válido.');
            document.getElementById('rutCliente').focus();
            return false;
        }
    }
    
    // Validar carrito de servicios
    if (!carritoServicios || carritoServicios.length === 0) {
        alert('Debe seleccionar al menos un servicio.');
        document.getElementById('tipoServicio').focus();
        return false;
    }
    
    return true;
}

function validarRUT(rut) {
    // Formato básico del RUT chileno: xxxxxxxx-y
    const rutRegex = /^\d{7,8}-[0-9kK]$/;
    return rutRegex.test(rut);
}

function obtenerSiguienteNumeroOrden() {
    let ultimo = parseInt(localStorage.getItem('ultimo_numero_orden_externo') || '1000', 10);
    ultimo = isNaN(ultimo) ? 1000 : ultimo + 1;
    localStorage.setItem('ultimo_numero_orden_externo', ultimo);
    return `SOL-${ultimo}`;
}

function guardarOrden(datosOrden) {
    // Guardar en localStorage
    let solicitudesExternas = JSON.parse(localStorage.getItem('solicitudes_externas') || '[]');
    solicitudesExternas.push(datosOrden);
    localStorage.setItem('solicitudes_externas', JSON.stringify(solicitudesExternas));
    
    // También guardamos una copia en el almacén general de órdenes para su procesamiento
    let ordenesGenerales = JSON.parse(localStorage.getItem('tecnico_general') || '[]');
    ordenesGenerales.push(datosOrden);
    localStorage.setItem('tecnico_general', JSON.stringify(ordenesGenerales));
}

function mostrarModalConfirmacion(numeroOrden) {
    document.getElementById('numeroOrdenGenerado').textContent = numeroOrden;
    document.getElementById('modalConfirmacion').style.display = 'flex';
}

function limpiarFormulario() {
    if (confirm('¿Está seguro que desea limpiar el formulario?')) {
        document.getElementById('solicitudForm').reset();
        carritoServicios = [];
        renderizarCarritoServicios();
        mostrarFechaActual();
    }
}

function nuevaSolicitud() {
    document.getElementById('modalConfirmacion').style.display = 'none';
    document.getElementById('solicitudForm').reset();
    carritoServicios = [];
    renderizarCarritoServicios();
    mostrarFechaActual();
    document.getElementById('nombreCliente').focus();
}

function volverInicio() {
    window.location.href = 'client.html';
}