// js/ordenes-mantencion.js
// Maódulo para mostrar órdenes que requieren cambio de piezas y gestionar repuestos faltantes

function cargarOrdenesCambioPiezas() {
    // Obtener todas las órdenes guardadas
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    // Filtrar solo las que tienen piezas a cambiar (simulación: si la falla menciona "cambiar" o "actualizar")
    const ordenesCambio = solicitudes.filter(s => {
        if (!s.falla) return false;
        const texto = s.falla.toLowerCase();
        return texto.includes('cambiar') || texto.includes('actualizar') || texto.includes('reemplazar');
    });
    mostrarOrdenesCambioPiezas(ordenesCambio);
}

function mostrarOrdenesCambioPiezas(ordenes) {
    const contenedor = document.getElementById('ordenesCambioPiezasBody');
    contenedor.innerHTML = '';
    if (ordenes.length === 0) {
        contenedor.innerHTML = '<tr><td colspan="5">No hay órdenes con cambio de piezas.</td></tr>';
        return;
    }
    ordenes.forEach(orden => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${orden.numeroOrden || ''}</td>
            <td>${orden.clienteNombre || orden.cliente?.nombre || ''}</td>
            <td>${orden.equipoMarca || orden.equipo?.marca || ''} ${orden.equipoModelo || orden.equipo?.modelo || ''}</td>
            <td>${orden.falla || ''}</td>
            <td><button onclick="agregarRepuestosFaltantesAlCarrito('${orden.numeroOrden}')">Agregar repuestos faltantes</button></td>
        `;
        contenedor.appendChild(tr);
    });
}

function agregarRepuestosFaltantesAlCarrito(numeroOrden) {
    // Buscar la orden
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    const orden = solicitudes.find(s => s.numeroOrden === numeroOrden);
    if (!orden) return alert('Orden no encontrada.');
    // Simulación: buscar palabras clave de piezas en la falla
    const piezas = extraerPiezasDeTexto(orden.falla || '');
    if (piezas.length === 0) return alert('No se detectaron piezas a cambiar en la descripción.');
    // Buscar en inventario y agregar faltantes al carrito
    let repuestos = JSON.parse(localStorage.getItem('repuestos_data') || '[]');
    let compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
    let agregados = [];
    piezas.forEach(pieza => {
        const repuesto = repuestos.find(r => r.nombre.toLowerCase().includes(pieza));
        if (!repuesto || repuesto.stock === 0) {
            // Si no existe o está agotado, agregar al carrito
            if (!compras.find(c => c.nombre.toLowerCase().includes(pieza))) {
                compras.push({
                    codigo: repuesto ? repuesto.codigo : 'N/A',
                    nombre: pieza.charAt(0).toUpperCase() + pieza.slice(1),
                    cantidad: 1,
                    proveedor: repuesto ? repuesto.proveedor : '',
                    precio: repuesto ? repuesto.precio : 0,
                    total: repuesto ? repuesto.precio : 0,
                    fechaSolicitud: new Date().toISOString(),
                    urgente: true
                });
                agregados.push(pieza);
            }
        }
    });
    localStorage.setItem('compras_pendientes', JSON.stringify(compras));
    if (agregados.length > 0) {
        alert('Se agregaron al carrito los siguientes repuestos faltantes: ' + agregados.join(', '));
    } else {
        alert('No se agregaron nuevos repuestos.');
    }
    if (typeof cargarComprasPendientes === 'function') cargarComprasPendientes();
}

function extraerPiezasDeTexto(texto) {
    // Palabras clave de piezas comunes
    const piezas = ['procesador', 'memoria', 'ram', 'ssd', 'disco', 'placa', 'fuente', 'tarjeta', 'cable', 'ventilador', 'cooler', 'bateria', 'pantalla', 'teclado', 'mouse', 'refrigeracion', 'motherboard', 'video'];
    texto = texto.toLowerCase();
    return piezas.filter(p => texto.includes(p));
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ordenesCambioPiezasBody')) {
        cargarOrdenesCambioPiezas();
    }
});
