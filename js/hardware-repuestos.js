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


let comprasSolicitadas = JSON.parse(localStorage.getItem('compras_solicitadas')) || [];

document.addEventListener('DOMContentLoaded', function() {
    
    initializeHardwareModule();
    cargarTablaRepuestos();
    actualizarEstadisticas();
    cargarListaComprasSolicitadas(); 
});

function verificarAutenticacion() {
    
}

function initializeHardwareModule() {
    const datosGuardados = localStorage.getItem('repuestos_data');
    if (datosGuardados) {
        repuestosData = JSON.parse(datosGuardados);
        repuestosFiltrados = [...repuestosData];
    }
    
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
    
    if (datos.stock === 0) {
        datos.estado = 'agotado';
    } else if (datos.stock <= datos.minimo) {
        datos.estado = 'critico';
    } else {
        datos.estado = 'disponible';
    }
    
    const indice = repuestosData.findIndex(r => r.codigo === datos.codigo);
    
    if (indice >= 0) {
        repuestosData[indice] = datos;
    } else {
        repuestosData.push(datos);
    }
    
    localStorage.setItem('repuestos_data', JSON.stringify(repuestosData));
    
    cerrarModal();
    filtrarRepuestos();
    actualizarEstadisticas();
    cargarListaComprasSolicitadas(); 
    
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
    cargarListaComprasSolicitadas(); 
    
    alert(`${repuesto.nombre} marcado como crítico.`);
}

function solicitarCompra(codigo) {
    const repuesto = repuestosData.find(r => r.codigo === codigo);
    if (!repuesto) return;
    
    const cantidad = prompt(`¿Cuántas unidades deseas solicitar de ${repuesto.nombre}?`, repuesto.minimo * 2);
    
    if (cantidad && parseInt(cantidad) > 0) {
        repuesto.estado = 'pedido';
        localStorage.setItem('repuestos_data', JSON.stringify(repuestosData));
        
        
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
        cargarListaComprasSolicitadas(); 
        
        alert(`Solicitud de compra creada: ${cantidad} unidades de ${repuesto.nombre}`);
    }
}


function cargarListaComprasSolicitadas() {
    const tbody = document.getElementById('comprasSolicitadasBody');
    tbody.innerHTML = '';
    
    comprasSolicitadas.forEach((compra, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${compra.repuesto}</td>
            <td>${compra.proveedor || ''}</td>
            <td>${compra.direccion || ''}</td>
            <td>${compra.valor ? '$' + compra.valor.toLocaleString('es-CL') : ''}</td>
            <td class="acciones">
                <button onclick="editarItemCompra(${index})" class="btn-icon" title="Editar">✏️</button>
                <button onclick="eliminarItemCompra(${index})" class="btn-icon" title="Eliminar">🗑️</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function agregarRepuestoACompra() {
    const repuesto = document.getElementById('inputRepuesto').value.trim();
    const proveedor = document.getElementById('inputProveedor').value.trim();
    const direccion = document.getElementById('inputDireccion').value.trim();
    const valor = parseFloat(document.getElementById('inputValor').value);

    if (!repuesto) {
        alert('El nombre del repuesto es obligatorio.');
        return;
    }
    
    comprasSolicitadas.push({
        repuesto,
        proveedor,
        direccion,
        valor
    });
    
    guardarYRecargarCompras();
    limpiarFormularioCompra();
}

function editarItemCompra(index) {
    const compra = comprasSolicitadas[index];
    
    document.getElementById('inputRepuesto').value = compra.repuesto;
    document.getElementById('inputProveedor').value = compra.proveedor;
    document.getElementById('inputDireccion').value = compra.direccion;
    document.getElementById('inputValor').value = compra.valor;
    
    eliminarItemCompra(index);
}

function eliminarItemCompra(index) {
    if (confirm('¿Estás seguro que deseas eliminar este repuesto de la lista?')) {
        comprasSolicitadas.splice(index, 1);
        guardarYRecargarCompras();
    }
}

function guardarYRecargarCompras() {
    localStorage.setItem('compras_solicitadas', JSON.stringify(comprasSolicitadas));
    cargarListaComprasSolicitadas();
}

function limpiarFormularioCompra() {
    document.getElementById('inputRepuesto').value = '';
    document.getElementById('inputProveedor').value = '';
    document.getElementById('inputDireccion').value = '';
    document.getElementById('inputValor').value = '';
}



function generarOrdenCompra() {
    alert('Generando orden de compra con la lista actual...');
}

function contactarProveedor() {
    alert('Abriendo sistema de contacto con proveedores...\n(Funcionalidad pendiente de implementar)');
}

function exportarInventario() {
    alert('Exportando inventario completo...\n(Funcionalidad de exportación pendiente)');
}