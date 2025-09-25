// --- Carrito de servicios ---
let carritoServicios = [];
const PRECIO_SERVICIO = 5000; // Precio fijo por servicio

function renderizarCarritoServicios() {
    const ul = document.getElementById('carritoServicios');
    ul.innerHTML = '';
    carritoServicios.forEach((serv, idx) => {
        const li = document.createElement('li');
        li.textContent = `${serv} — $${PRECIO_SERVICIO.toLocaleString('es-CL')} CLP`;
        // Botón para eliminar servicio del carrito
        const btn = document.createElement('button');
        btn.textContent = '✖';
        btn.type = 'button';
        btn.style.marginLeft = '0.5em';
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

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
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
    
    renderizarCarritoServicios();
});
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
document.addEventListener('DOMContentLoaded', function() {
    
    initializeSolicitudForm();
    cargarBorradorSiExiste();
});

function verificarAutenticacion() {
    
}


let repuestosSolicitud = [];


function agregarRepuestoManual() {
    const input = document.getElementById('repuestosNecesariosInput');
    const repuesto = input.value.trim();
    if (repuesto) {
        repuestosSolicitud.push(repuesto);
        input.value = '';
        actualizarListaRepuestos();
    }
}


function actualizarListaRepuestos() {
    const lista = document.getElementById('listaRepuestosNecesarios');
    lista.innerHTML = repuestosSolicitud.map(rep => `<div class="repuesto-item">${rep}</div>`).join('');
}


function obtenerDatosFormulario() {
    return {
        
        servicio: {
            
            repuestos: repuestosSolicitud, 
        },
        fechaCreacion: new Date().toISOString(),
        usuario: JSON.parse(localStorage.getItem('usuario_logueado')).username
    };
}


function guardarBorrador() {
    const datos = obtenerDatosFormulario();
    
    datos.servicio.repuestos = repuestosSolicitud;
    localStorage.setItem('solicitud_borrador', JSON.stringify(datos));
    alert('Borrador guardado exitosamente.');
}


function cargarBorrador(datos) {
    repuestosSolicitud = datos.servicio.repuestos || [];
    actualizarListaRepuestos();
}

function initializeSolicitudForm() {
    const form = document.getElementById('solicitudForm');
    
    
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaEntrega').min = hoy;
    
    
    document.getElementById('clienteRut').addEventListener('input', function(e) {
        formatearRUT(e.target);
    });
    
    
    document.getElementById('clienteTelefono').addEventListener('input', function(e) {
        formatearTelefono(e.target);
    });
    
    
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

    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarSolicitud();
    });

    
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
    // Obtener datos del formulario
    const formData = obtenerDatosFormulario();
    // Generar número de orden autoincremental
    const numeroOrden = obtenerSiguienteNumeroOrden();
    // Mostrar el número en el campo correspondiente (ahora lo guardamos para el modal)
    // Preparar datos de la orden
    const datosOrden = {
        ...formData,
        numeroOrden,
        servicios: [...carritoServicios],
        abono: document.getElementById('incluirAbono').checked ? Number(document.getElementById('abonoMonto').value) : 0,
        tecnico: document.getElementById('tecnicoResponsable').value.trim(),
        prioridad: document.getElementById('prioridad').value,
        descripcion: document.getElementById('descripcionProblema').value.trim(),
        fecha: new Date().toISOString(),
        fechaRegistro: document.getElementById('fechaRegistro').value
    };
    // Guardar la orden según tipo
    guardarOrdenPorTipo(datosOrden);
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(numeroOrden);
    // Limpiar carrito y formulario
    carritoServicios = [];
    renderizarCarritoServicios();
    localStorage.removeItem('solicitud_borrador');
}

function validarFormulario() {
    const campos = [
        'nombreCliente', 'telefonoCliente',
        'tipoEquipo', 'marcaEquipo', 'prioridad', 'descripcionProblema', 'tecnicoResponsable'
    ];
    for (let campo of campos) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value.trim()) {
            alert(`El campo "${elemento && elemento.previousElementSibling ? elemento.previousElementSibling.textContent : campo}" es obligatorio.`);
            if (elemento) elemento.focus();
            return false;
        }
    }
    // Validar carrito de servicios
    if (!carritoServicios || carritoServicios.length === 0) {
        alert('Debes agregar al menos un servicio al carrito.');
        document.getElementById('tipoServicio').focus();
        return false;
    }
    // Validar abono si está visible
    const abonoCheckbox = document.getElementById('incluirAbono');
    const abonoMontoInput = document.getElementById('abonoMonto');
    if (abonoCheckbox && abonoCheckbox.checked) {
        if (!abonoMontoInput.value.trim() || Number(abonoMontoInput.value) < 0) {
            alert('Debe ingresar un monto válido para el abono.');
            abonoMontoInput.focus();
            return false;
        }
    }
    // Validar RUT si está habilitado
    const rutInput = document.getElementById('rutCliente');
    if (rutInput && !rutInput.disabled) {
        const rut = rutInput.value;
        if (!validarRUT(rut)) {
            alert('El formato del RUT no es válido.');
            rutInput.focus();
            return false;
        }
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
    
    document.getElementById('clienteNombre').value = datos.cliente.nombre || '';
    document.getElementById('clienteRut').value = datos.cliente.rut || '';
    document.getElementById('clienteTelefono').value = datos.cliente.telefono || '';
    document.getElementById('clienteEmail').value = datos.cliente.email || '';
    document.getElementById('clienteDireccion').value = datos.cliente.direccion || '';
    
    
    document.getElementById('equipoTipo').value = datos.equipo.tipo || '';
    document.getElementById('equipoMarca').value = datos.equipo.marca || '';
    document.getElementById('equipoModelo').value = datos.equipo.modelo || '';
    document.getElementById('equipoSerial').value = datos.equipo.serial || '';
    document.getElementById('equipoAccesorios').value = datos.equipo.accesorios || '';
    
    
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

function obtenerSiguienteNumeroOrden() {
    let ultimo = parseInt(localStorage.getItem('ultimo_numero_orden') || '0', 10);
    ultimo = isNaN(ultimo) ? 0 : ultimo + 1;
    if (ultimo > 99999) ultimo = 1;
    localStorage.setItem('ultimo_numero_orden', ultimo);
    return String(ultimo).padStart(5, '0');
}

function guardarOrdenPorTipo(datosOrden) {
    // Determinar si es hardware o software
    const serviciosHardware = [
        'Problemas de hardware', 'Sobrecalentamiento', 'Mantención general'
    ];
    const serviciosSoftware = [
        'Instalación de sistema operativo', 'Actualizaciones de sistema operativo', 'Instalación de software', 'Eliminación de virus', 'Formateo', 'Respaldos'
    ];
    let destino = 'tecnico_general';
    for (const s of datosOrden.servicios) {
        if (serviciosHardware.includes(s)) destino = 'tecnico_hardware';
        if (serviciosSoftware.includes(s)) destino = 'tecnico_software';
    }
    // Si hay ambos tipos, se prioriza hardware
    if (destino === 'tecnico_software' && datosOrden.servicios.some(s => serviciosHardware.includes(s))) {
        destino = 'tecnico_hardware';
    }
    // Guardar en localStorage
    let lista = JSON.parse(localStorage.getItem(destino) || '[]');
    lista.push(datosOrden);
    localStorage.setItem(destino, JSON.stringify(lista));
}