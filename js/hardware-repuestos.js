// Funciones para hardware-repuestos.html

// Datos de ejemplo para repuestos
let repuestosData = [
    {
        codigo: 'CPU001',
        nombre: 'Intel Core i5-12400F',
        categoria: 'procesador',
        stock: 5,
        minimo: 10,
        precio: 180000,
        estado: 'critico',
        proveedor: 'TechSupply'
    },
    {
        codigo: 'RAM001',
        nombre: 'Kingston DDR4 8GB 3200MHz',
        categoria: 'memoria',
        stock: 0,
        minimo: 15,
        precio: 45000,
        estado: 'agotado',
        proveedor: 'MemoryPlus'
    },
    {
        codigo: 'SSD001',
        nombre: 'Samsung SSD 970 EVO 500GB',
        categoria: 'almacenamiento',
        stock: 12,
        minimo: 8,
        precio: 85000,
        estado: 'disponible',
        proveedor: 'StorageWorld'
    },
    {
        codigo: 'GPU001',
        nombre: 'NVIDIA RTX 3060 Ti',
        categoria: 'tarjeta-video',
        stock: 3,
        minimo: 5,
        precio: 350000,
        estado: 'critico',
        proveedor: 'GraphicsMax'
    },
    {
        codigo: 'PSU001',
        nombre: 'Corsair 650W 80+ Bronze',
        categoria: 'fuente',
        stock: 8,
        minimo: 6,
        precio: 95000,
        estado: 'disponible',
        proveedor: 'PowerComponents'
    },
    {
        codigo: 'MB001',
        nombre: 'ASUS B550M-A WiFi',
        categoria: 'placa-madre',
        stock: 6,
        minimo: 4,
        precio: 120000,
        estado: 'disponible',
        proveedor: 'BoardsTech'
    },
    {
        codigo: 'COOL001',
        nombre: 'Cooler Master Hyper 212',
        categoria: 'refrigeracion',
        stock: 0,
        minimo: 8,
        precio: 35000,
        estado: 'pedido',
        proveedor: 'CoolingPro'
    },
    {
        codigo: 'CABLE001',
        nombre: 'Cable SATA 3.0 50cm',
        categoria: 'cables',
        stock: 25,
        minimo: 20,
        precio: 3500,
        estado: 'disponible',
        proveedor: 'CableWorks'
    }
];

let repuestosFiltrados = [...repuestosData];

document.addEventListener('DOMContentLoaded', function() {
    // verificarAutenticacion(); // Comentado para permitir acceso libre
    initializeHardwareModule();
    cargarTablaRepuestos();
    actualizarEstadisticas();
    cargarComprasPendientes();
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

function initializeHardwareModule() {
    // Cargar datos guardados si existen
    const datosGuardados = localStorage.getItem('repuestos_data');
    if (datosGuardados) {
        repuestosData = JSON.parse(datosGuardados);
        repuestosFiltrados = [...repuestosData];
    }
    
    // Configurar formulario modal
    document.getElementById('formRepuesto').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRepuesto();
    });
}

function cargarTablaRepuestos() {
    const tbody = document.getElementById('tablaRepuestosBody');
    tbody.innerHTML = '';
    
    repuestosFiltrados.forEach(repuesto => {
        const fila = crearFilaRepuesto(repuesto);
        tbody.appendChild(fila);
    });
}

function crearFilaRepuesto(repuesto) {
    const tr = document.createElement('tr');
    tr.className = `estado-${repuesto.estado}`;
    
    tr.innerHTML = `
        <td class="codigo">${repuesto.codigo}</td>
        <td class="nombre">${repuesto.nombre}</td>
        <td class="categoria">${obtenerNombreCategoria(repuesto.categoria)}</td>
        <td class="stock ${repuesto.stock <= repuesto.minimo ? 'stock-bajo' : ''}">${repuesto.stock}</td>
        <td class="minimo">${repuesto.minimo}</td>
        <td class="precio">$${repuesto.precio.toLocaleString('es-CL')}</td>
        <td class="estado">
            <span class="badge badge-${repuesto.estado}">${obtenerNombreEstado(repuesto.estado)}</span>
        </td>
        <td class="proveedor">${repuesto.proveedor}</td>
        <td class="acciones">
            <button onclick="editarRepuesto('${repuesto.codigo}')" class="btn-icon" title="Editar">✏️</button>
            <button onclick="marcarCritico('${repuesto.codigo}')" class="btn-icon" title="Marcar como crítico">⚠️</button>
            <button onclick="solicitarCompra('${repuesto.codigo}')" class="btn-icon" title="Solicitar compra">🛒</button>
        </td>
    `;
    
    return tr;
}

function obtenerNombreCategoria(categoria) {
    const nombres = {
        'procesador': 'Procesadores',
        'memoria': 'Memoria RAM',
        'almacenamiento': 'Almacenamiento',
        'tarjeta-video': 'Tarjetas de Video',
        'fuente': 'Fuentes de Poder',
        'placa-madre': 'Placas Madre',
        'refrigeracion': 'Refrigeración',
        'cables': 'Cables y Conectores',
        'otros': 'Otros'
    };
    return nombres[categoria] || categoria;
}

function obtenerNombreEstado(estado) {
    const nombres = {
        'disponible': 'Disponible',
        'critico': 'Crítico',
        'agotado': 'Agotado',
        'pedido': 'En Pedido'
    };
    return nombres[estado] || estado;
}

function actualizarEstadisticas() {
    const criticos = repuestosData.filter(r => r.estado === 'critico').length;
    const agotados = repuestosData.filter(r => r.estado === 'agotado').length;
    const pedidos = repuestosData.filter(r => r.estado === 'pedido').length;
    const total = repuestosData.length;
    
    document.getElementById('statCriticos').textContent = criticos;
    document.getElementById('statAgotados').textContent = agotados;
    document.getElementById('statPedidos').textContent = pedidos;
    document.getElementById('statTotal').textContent = total;
}

function filtrarRepuestos() {
    const categoria = document.getElementById('filtroCategoria').value;
    const estado = document.getElementById('filtroEstado').value;
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    
    repuestosFiltrados = repuestosData.filter(repuesto => {
        const matchCategoria = !categoria || repuesto.categoria === categoria;
        const matchEstado = !estado || repuesto.estado === estado;
        const matchBusqueda = !busqueda || 
            repuesto.nombre.toLowerCase().includes(busqueda) ||
            repuesto.codigo.toLowerCase().includes(busqueda);
        
        return matchCategoria && matchEstado && matchBusqueda;
    });
    
    cargarTablaRepuestos();
}

function limpiarFiltros() {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroEstado').value = '';
    document.getElementById('busqueda').value = '';
    repuestosFiltrados = [...repuestosData];
    cargarTablaRepuestos();
}

function agregarRepuesto() {
    document.getElementById('modalTitulo').textContent = 'Agregar Nuevo Repuesto';
    limpiarFormularioModal();
    document.getElementById('modalRepuesto').style.display = 'flex';
}

function editarRepuesto(codigo) {
    const repuesto = repuestosData.find(r => r.codigo === codigo);
    if (!repuesto) return;
    
    document.getElementById('modalTitulo').textContent = 'Editar Repuesto';
    cargarDatosEnModal(repuesto);
    document.getElementById('modalRepuesto').style.display = 'flex';
}

function cargarDatosEnModal(repuesto) {
    document.getElementById('modalCodigo').value = repuesto.codigo;
    document.getElementById('modalNombre').value = repuesto.nombre;
    document.getElementById('modalCategoria').value = repuesto.categoria;
    document.getElementById('modalProveedor').value = repuesto.proveedor;
    document.getElementById('modalStock').value = repuesto.stock;
    document.getElementById('modalMinimo').value = repuesto.minimo;
    document.getElementById('modalPrecio').value = repuesto.precio;
    
    // Deshabilitar edición del código
    document.getElementById('modalCodigo').readOnly = true;
}

function limpiarFormularioModal() {
    document.getElementById('formRepuesto').reset();
    document.getElementById('modalCodigo').readOnly = false;
}

function guardarRepuesto() {
    const datos = {
        codigo: document.getElementById('modalCodigo').value.trim(),
        nombre: document.getElementById('modalNombre').value.trim(),
        categoria: document.getElementById('modalCategoria').value,
        proveedor: document.getElementById('modalProveedor').value.trim(),
        stock: parseInt(document.getElementById('modalStock').value),
        minimo: parseInt(document.getElementById('modalMinimo').value),
        precio: parseFloat(document.getElementById('modalPrecio').value) || 0
    };
    
    // Determinar estado basado en stock
    if (datos.stock === 0) {
        datos.estado = 'agotado';
    } else if (datos.stock <= datos.minimo) {
        datos.estado = 'critico';
    } else {
        datos.estado = 'disponible';
    }
    
    // Verificar si es nuevo o edición
    const indice = repuestosData.findIndex(r => r.codigo === datos.codigo);
    
    if (indice >= 0) {
        repuestosData[indice] = datos;
    } else {
        repuestosData.push(datos);
    }
    
    // Guardar en localStorage
    localStorage.setItem('repuestos_data', JSON.stringify(repuestosData));
    
    cerrarModal();
    filtrarRepuestos();
    actualizarEstadisticas();
    cargarComprasPendientes();
    
    alert('Repuesto guardado exitosamente.');
}

function cerrarModal() {
    document.getElementById('modalRepuesto').style.display = 'none';
}

function marcarCritico(codigo) {
    const repuesto = repuestosData.find(r => r.codigo === codigo);
    if (!repuesto) return;
    
    repuesto.estado = 'critico';
    localStorage.setItem('repuestos_data', JSON.stringify(repuestosData));
    
    filtrarRepuestos();
    actualizarEstadisticas();
    cargarComprasPendientes();
    
    alert(`${repuesto.nombre} marcado como crítico.`);
}

function solicitarCompra(codigo) {
    const repuesto = repuestosData.find(r => r.codigo === codigo);
    if (!repuesto) return;
    
    const cantidad = prompt(`¿Cuántas unidades deseas solicitar de ${repuesto.nombre}?`, repuesto.minimo * 2);
    
    if (cantidad && parseInt(cantidad) > 0) {
        repuesto.estado = 'pedido';
        localStorage.setItem('repuestos_data', JSON.stringify(repuestosData));
        
        // Simular agregado a lista de compras
        let compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
        compras.push({
            codigo: repuesto.codigo,
            nombre: repuesto.nombre,
            cantidad: parseInt(cantidad),
            proveedor: repuesto.proveedor,
            precio: repuesto.precio,
            total: repuesto.precio * parseInt(cantidad),
            fechaSolicitud: new Date().toISOString(),
            urgente: repuesto.estado === 'agotado' || repuesto.stock === 0
        });
        localStorage.setItem('compras_pendientes', JSON.stringify(compras));
        
        filtrarRepuestos();
        actualizarEstadisticas();
        cargarComprasPendientes();
        
        alert(`Solicitud de compra creada: ${cantidad} unidades de ${repuesto.nombre}`);
    }
}

function cargarComprasPendientes() {
    const compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
    
    const urgentes = compras.filter(c => c.urgente);
    const normales = compras.filter(c => !c.urgente);
    
    cargarListaCompras('comprasUrgentes', urgentes);
    cargarListaCompras('comprasProgramadas', normales);
}

function cargarListaCompras(containerId, compras) {
    const container = document.getElementById(containerId);
    
    if (compras.length === 0) {
        container.innerHTML = '<p>No hay compras pendientes.</p>';
        return;
    }
    
    container.innerHTML = compras.map(compra => `
        <div class="compra-item">
            <div class="compra-info">
                <strong>${compra.nombre}</strong>
                <span class="compra-cantidad">Cantidad: ${compra.cantidad}</span>
                <span class="compra-proveedor">Proveedor: ${compra.proveedor}</span>
                <span class="compra-total">Total: $${compra.total.toLocaleString('es-CL')}</span>
            </div>
            <button onclick="eliminarCompra('${compra.codigo}')" class="btn-eliminar">❌</button>
        </div>
    `).join('');
}

function eliminarCompra(codigo) {
    if (confirm('¿Estás seguro que deseas eliminar esta compra?')) {
        let compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
        compras = compras.filter(c => c.codigo !== codigo);
        localStorage.setItem('compras_pendientes', JSON.stringify(compras));
        
        cargarComprasPendientes();
    }
}

function generarOrdenCompra() {
    const compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
    
    if (compras.length === 0) {
        alert('No hay compras pendientes para generar una orden.');
        return;
    }
    
    const total = compras.reduce((sum, compra) => sum + compra.total, 0);
    
    alert(`Orden de compra generada:\n\nTotal de items: ${compras.length}\nMonto total: $${total.toLocaleString('es-CL')}\n\n(Funcionalidad de exportación pendiente)`);
}

function contactarProveedor() {
    // Buscar los 5 precios más bajos en la web para cada repuesto del carrito
    let compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
    if (compras.length === 0) {
        alert('No hay repuestos en el carrito para comparar precios.');
        return;
    }
    let comparaciones = [];
    let pendientes = compras.length;
    compras.forEach((compra, idx) => {
        compararPreciosWeb(compra.nombre, function(resultados) {
            comparaciones[idx] = { nombre: compra.nombre, resultados };
            pendientes--;
            if (pendientes === 0) mostrarComparacionPrecios(comparaciones);
        });
    });
}

// Simulación de búsqueda web: en producción, esto se haría con una API real o scraping
function compararPreciosWeb(nombre, callback) {
    // Simular resultados con precios aleatorios y tiendas ficticias
    const tiendas = ['MercadoLibre', 'PC Factory', 'SP Digital', 'Weplay', 'Amazon', 'Linio', 'Paris', 'Ripley'];
    let resultados = [];
    for (let i = 0; i < 8; i++) {
        resultados.push({
            tienda: tiendas[i],
            precio: Math.floor(Math.random() * 100000) + 20000,
            url: `https://www.${tiendas[i].replace(/\s/g,'').toLowerCase()}.cl/buscar?q=${encodeURIComponent(nombre)}`
        });
    }
    resultados.sort((a, b) => a.precio - b.precio);
    callback(resultados.slice(0, 5));
}

function mostrarComparacionPrecios(comparaciones) {
    let html = '<h3>Comparación de Precios Web</h3>';
    comparaciones.forEach(comp => {
        html += `<h4>${comp.nombre}</h4><ol>`;
        comp.resultados.forEach(r => {
            html += `<li><a href="${r.url}" target="_blank">${r.tienda}</a>: $${r.precio.toLocaleString('es-CL')}</li>`;
        });
        html += '</ol>';
    });
    // Mostrar en modal o ventana nueva
    const w = window.open('', '_blank', 'width=600,height=700');
    w.document.write('<html><head><title>Comparación de Precios</title></head><body>' + html + '</body></html>');
}
function exportarInventario() {
    alert('Exportando inventario completo...\n(Funcionalidad de exportación pendiente)');
}