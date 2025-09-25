// Almacenamiento de órdenes filtradas
let ordenesData = [];
let ordenesFiltradas = [];
const PRECIO_SERVICIO = 5000; // Mismo precio que en ingresar-solicitud.js

// Orden actualmente seleccionada
let ordenSeleccionada = null;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el módulo
    cargarOrdenes();
    configurarEventos();
    actualizarEstadisticas();
    
    // Mostrar mensaje inicial en la sección de detalles
    mostrarMensajeSeleccionOrden();
});

function verificarAutenticacion() {
    // Por implementar si se necesita
}

// Función para cargar todas las órdenes desde localStorage
function cargarOrdenes() {
    // Cargamos todas las órdenes (hardware y software)
    const ordenesHardware = JSON.parse(localStorage.getItem('tecnico_hardware')) || [];
    
    // Ordenamos por fecha (más antiguas primero)
    ordenesData = ordenesHardware.sort((a, b) => {
        return new Date(a.fecha) - new Date(b.fecha);
    });
    
    // Tomamos sólo las primeras 10 órdenes
    ordenesFiltradas = ordenesData.slice(0, 10);
    
    // Cargamos la tabla
    cargarTablaOrdenes();
}

// Función para configurar eventos de los elementos
function configurarEventos() {
    // Configurar eventos para filtros
    document.getElementById('filtroFecha').addEventListener('change', filtrarOrdenes);
    document.getElementById('filtroEquipo').addEventListener('change', filtrarOrdenes);
    document.getElementById('busqueda').addEventListener('keyup', filtrarOrdenes);
    
    // Otros eventos
    document.getElementById('marcarListo').addEventListener('change', function() {
        const checkbox = document.getElementById('marcarListo');
        // Habilitamos el botón de guardar cuando se marca el checkbox
        document.querySelector('.orden-acciones .btn-primary').disabled = !checkbox.checked;
    });
}

// Función para cargar la tabla de órdenes
function cargarTablaOrdenes() {
    const tbody = document.getElementById('tablaOrdenesBody');
    tbody.innerHTML = '';
    
    // Limitamos a 10 órdenes como máximo
    const ordenesAMostrar = ordenesFiltradas.slice(0, 10);
    
    ordenesAMostrar.forEach(orden => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${orden.numeroOrden}</td>
            <td>${orden.cliente?.nombre || 'No especificado'}</td>
            <td>${orden.equipo?.tipo || 'No especificado'}</td>
            <td>${orden.equipo?.marca || 'No especificado'}</td>
            <td>${orden.equipo?.modelo || 'No especificado'}</td>
            <td>${orden.descripcion?.substring(0, 30)}${orden.descripcion?.length > 30 ? '...' : ''}</td>
            <td><input type="checkbox" ${orden.listoParaEntregar ? 'checked' : ''} disabled></td>
        `;
        
        // Agregar evento clic para mostrar detalles
        tr.addEventListener('click', function() {
            mostrarDetallesOrden(orden.numeroOrden);
        });
        
        tbody.appendChild(tr);
    });
}// Función para mostrar detalles de una orden específica
function mostrarDetallesOrden(numeroOrden) {
    // Encontrar la orden por su número
    const orden = ordenesData.find(o => o.numeroOrden === numeroOrden);
    if (!orden) {
        alert('Orden no encontrada');
        return;
    }
    
    ordenSeleccionada = orden;
    
    // No necesitamos ocultar la tabla, ambas secciones estarán visibles
    
    // Llenar información del cliente
    document.getElementById('ordenNumero').textContent = orden.numeroOrden;
    document.getElementById('detalleNombreCliente').textContent = orden.cliente?.nombre || 'No especificado';
    document.getElementById('detalleRutCliente').textContent = orden.rutCliente || orden.pasaporteCliente || 'No especificado';
    document.getElementById('detalleTelefonoCliente').textContent = orden.telefonoCliente || 'No especificado';
    document.getElementById('detalleCorreoCliente').textContent = orden.correoCliente || 'No especificado';
    document.getElementById('detalleDireccionCliente').textContent = 
        `${orden.comunaCliente || ''} ${orden.domicilioCliente || ''}`.trim() || 'No especificado';
    
    // Llenar información del equipo
    document.getElementById('detalleTipoEquipo').textContent = orden.equipo?.tipo || 'No especificado';
    document.getElementById('detalleMarcaEquipo').textContent = orden.equipo?.marca || 'No especificado';
    document.getElementById('detalleModeloEquipo').textContent = orden.equipo?.modelo || 'No especificado';
    
    // Llenar servicios solicitados
    const listaServicios = document.getElementById('detalleServiciosList');
    listaServicios.innerHTML = '';
    
    if (orden.servicios && orden.servicios.length > 0) {
        orden.servicios.forEach(servicio => {
            const li = document.createElement('li');
            li.textContent = `${servicio} — $${PRECIO_SERVICIO.toLocaleString('es-CL')} CLP`;
            listaServicios.appendChild(li);
        });
        // Mostrar total
        document.getElementById('detalleTotal').textContent = 
            (orden.servicios.length * PRECIO_SERVICIO).toLocaleString('es-CL');
    } else {
        listaServicios.innerHTML = '<li>No hay servicios especificados</li>';
        document.getElementById('detalleTotal').textContent = '0';
    }
    
    // Llenar descripción
    document.getElementById('detalleDescripcion').textContent = orden.descripcion || 'No hay descripción disponible';
    
    // Llenar información técnica
    document.getElementById('detalleTecnico').textContent = orden.tecnico || 'No asignado';
    document.getElementById('detallePrioridad').textContent = orden.prioridad || 'Normal';
    document.getElementById('detalleAbono').textContent = (orden.abono || 0).toLocaleString('es-CL');
    document.getElementById('detalleFecha').textContent = 
        orden.fecha ? new Date(orden.fecha).toLocaleString('es-CL') : 'No especificado';
    
    // Configurar estado "listo para entregar"
    document.getElementById('marcarListo').checked = orden.listoParaEntregar || false;
    document.getElementById('observacionesTecnicas').value = orden.observacionesTecnicas || '';
    
    // Habilitar campos de edición
    document.getElementById('observacionesTecnicas').disabled = false;
    document.getElementById('marcarListo').disabled = false;
    
    // Deshabilitamos el botón de guardar inicialmente
    document.querySelector('.orden-acciones .btn-primary').disabled = !document.getElementById('marcarListo').checked;
}

// Función para mostrar un mensaje cuando no hay orden seleccionada
function mostrarMensajeSeleccionOrden() {
    const detalleOrden = document.querySelector('.orden-detalle-contenido');
    
    // Limpiar el detalle de orden
    detalleOrden.innerHTML = `
        <div class="mensaje-seleccion">
            <h3>Seleccione una orden</h3>
            <p>Por favor, seleccione una orden de la tabla para ver sus detalles.</p>
            <div class="icono-seleccion">
                <i class="fas fa-hand-pointer"></i>
            </div>
        </div>
    `;
    
    // Deshabilitar campos de edición
    document.getElementById('observacionesTecnicas').disabled = true;
    document.getElementById('marcarListo').disabled = true;
    
    // Deshabilitar el botón de guardar
    document.querySelector('.orden-acciones .btn-primary').disabled = true;
}

// Función para volver a la tabla de órdenes
function volverATabla() {
    // Simplemente limpiamos la selección actual
    ordenSeleccionada = null;
    
    // Mostrar mensaje de "ninguna orden seleccionada"
    mostrarMensajeSeleccionOrden();
}

// Función para guardar cambios en la orden
function guardarCambiosOrden() {
    if (!ordenSeleccionada) {
        alert('No hay una orden seleccionada');
        return;
    }
    
    // Verificar si se marcó como listo
    const listoParaEntregar = document.getElementById('marcarListo').checked;
    const observacionesTecnicas = document.getElementById('observacionesTecnicas').value.trim();
    
    // Actualizar la orden seleccionada
    ordenSeleccionada.listoParaEntregar = listoParaEntregar;
    ordenSeleccionada.observacionesTecnicas = observacionesTecnicas;
    
    // Actualizar el localStorage
    guardarCambiosEnStorage();
    
    // Actualizar la tabla
    cargarOrdenes();
    
    // Volver a la tabla
    volverATabla();
    
    alert('Cambios guardados correctamente');
}

// Función para guardar los cambios en localStorage
function guardarCambiosEnStorage() {
    // Encontrar la orden en el arreglo
    const index = ordenesData.findIndex(o => o.numeroOrden === ordenSeleccionada.numeroOrden);
    if (index !== -1) {
        ordenesData[index] = ordenSeleccionada;
        
        // Guardar en localStorage
        localStorage.setItem('tecnico_hardware', JSON.stringify(ordenesData));
    }
}

// Función para filtrar órdenes
function filtrarOrdenes() {
    const fecha = document.getElementById('filtroFecha').value;
    const tipoEquipo = document.getElementById('filtroEquipo').value;
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    
    ordenesFiltradas = ordenesData.filter(orden => {
        // Filtro por fecha
        let pasaFiltroFecha = true;
        if (fecha) {
            const fechaOrden = orden.fecha ? new Date(orden.fecha).toISOString().split('T')[0] : '';
            pasaFiltroFecha = fechaOrden === fecha;
        }
        
        // Filtro por tipo de equipo
        let pasaFiltroEquipo = true;
        if (tipoEquipo) {
            pasaFiltroEquipo = orden.equipo?.tipo === tipoEquipo;
        }
        
        // Filtro por búsqueda
        let pasaBusqueda = true;
        if (busqueda) {
            const nombreCliente = orden.cliente?.nombre?.toLowerCase() || '';
            const numeroOrden = orden.numeroOrden?.toLowerCase() || '';
            pasaBusqueda = nombreCliente.includes(busqueda) || numeroOrden.includes(busqueda);
        }
        
        return pasaFiltroFecha && pasaFiltroEquipo && pasaBusqueda;
    });
    
    cargarTablaOrdenes();
}

// Función para limpiar filtros
function limpiarFiltros() {
    document.getElementById('filtroFecha').value = '';
    document.getElementById('filtroEquipo').value = '';
    document.getElementById('busqueda').value = '';
    
    ordenesFiltradas = ordenesData.slice(0, 10);
    cargarTablaOrdenes();
}

// Función para actualizar las estadísticas
function actualizarEstadisticas() {
    const pendientes = ordenesData.filter(o => !o.listoParaEntregar).length;
    const enProceso = ordenesData.filter(o => !o.listoParaEntregar && o.observacionesTecnicas).length;
    const listos = ordenesData.filter(o => o.listoParaEntregar).length;
    const total = ordenesData.length;
    
    document.getElementById('statPendientes').textContent = pendientes;
    document.getElementById('statEnProceso').textContent = enProceso;
    document.getElementById('statListos').textContent = listos;
    document.getElementById('statTotal').textContent = total;
}

// Función auxiliar para formatear fechas
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No especificada';
    
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para exportar el listado de órdenes
function exportarInventario() {
    alert('Exportando listado de órdenes...');
    // Implementación pendiente
}

// Función para obtener un valor seguro (evitar undefined)
function valorSeguro(valor, valorPorDefecto = 'No especificado') {
    return valor || valorPorDefecto;
}

// Exportar inventario - Función de ejemplo para una futura implementación
function exportarInventario() {
    alert('Exportando listado de órdenes...\n(Funcionalidad pendiente de implementar)');
}