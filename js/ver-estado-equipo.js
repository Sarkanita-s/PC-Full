// Faunciones para ver-estado-equipo.html

// Event listeners que se ejecutan cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeEstadoEquipo();
});

function initializeEstadoEquipo() {
    // Listener para cambio de tipo de consulta
    document.getElementById('tipoConsulta').addEventListener('change', function() {
        const tipo = this.value;
        const numeroOrdenGroup = document.getElementById('numeroOrdenGroup');
        const rutGroup = document.getElementById('rutGroup');
        
        // Ocultar ambos grupos
        numeroOrdenGroup.style.display = 'none';
        rutGroup.style.display = 'none';
        
        // Limpiar campos cuando se cambia el tipo
        document.getElementById('numeroOrden').value = '';
        document.getElementById('rut').value = '';
        
        // Mostrar el grupo correspondiente
        if (tipo === 'orden') {
            numeroOrdenGroup.style.display = 'block';
            document.getElementById('numeroOrden').required = true;
            document.getElementById('rut').required = false;
        } else if (tipo === 'rut') {
            rutGroup.style.display = 'block';
            document.getElementById('rut').required = true;
            document.getElementById('numeroOrden').required = false;
        }
    });

    // Listener para envío del formulario
    document.getElementById('estadoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tipoConsulta = document.getElementById('tipoConsulta').value;
        const numeroOrden = document.getElementById('numeroOrden').value;
        const rut = document.getElementById('rut').value;
        
        // Validar que se haya ingresado algún dato
        if (!tipoConsulta) {
            alert('Por favor selecciona el tipo de consulta.');
            return;
        }
        
        if (tipoConsulta === 'orden' && !numeroOrden.trim()) {
            alert('Por favor ingresa el número de orden.');
            return;
        }
        
        if (tipoConsulta === 'rut' && !rut.trim()) {
            alert('Por favor ingresa el RUT.');
            return;
        }
        
        // Simular consulta al servidor
        consultarEstado(tipoConsulta, numeroOrden, rut);
    });
}

function consultarEstado(tipo, orden, rut) {
    // Simular tiempo de carga
    mostrarCargando(true);
    
    setTimeout(() => {
        // Simular diferentes resultados según el input
        let datosEjemplo = null;
        
        if (tipo === 'orden') {
            datosEjemplo = obtenerDatosPorOrden(orden);
        } else if (tipo === 'rut') {
            datosEjemplo = obtenerDatosPorRut(rut);
        }
        
        mostrarCargando(false);
        
        if (datosEjemplo) {
            mostrarResultado(datosEjemplo);
        } else {
            mostrarError();
        }
    }, 1500); // Simular 1.5 segundos de carga
}

function obtenerDatosPorOrden(orden) {
    // Simular base de datos con diferentes órdenes
    const ordenes = {
        'ORD-2024-001': {
            ordenNumero: 'ORD-2024-001',
            clienteNombre: 'Juan Pérez',
            equipoDescripcion: 'Notebook HP Pavilion 15"',
            fechaIngreso: '15/09/2024',
            estadoActual: 'En Reparación',
            problemaDescripcion: 'Sobrecalentamiento y lentitud del sistema',
            etapaActual: 'reparacion',
            notas: 'Se está reemplazando el sistema de refrigeración y optimizando el sistema operativo.'
        },
        'ORD-2024-002': {
            ordenNumero: 'ORD-2024-002',
            clienteNombre: 'María González',
            equipoDescripcion: 'PC Desktop Intel i5',
            fechaIngreso: '12/09/2024',
            estadoActual: 'Listo para Entrega',
            problemaDescripcion: 'No enciende el equipo',
            etapaActual: 'finalizado',
            notas: 'Se reemplazó la fuente de poder. Equipo funcionando correctamente.'
        },
        'ORD-2024-003': {
            ordenNumero: 'ORD-2024-003',
            clienteNombre: 'Carlos Rodríguez',
            equipoDescripcion: 'Notebook Lenovo ThinkPad',
            fechaIngreso: '18/09/2024',
            estadoActual: 'En Diagnóstico',
            problemaDescripcion: 'Pantalla con líneas verticales',
            etapaActual: 'diagnostico',
            notas: 'Evaluando si el problema es del cable flex o del panel LCD.'
        }
    };
    
    return ordenes[orden.toUpperCase()] || null;
}

function obtenerDatosPorRut(rut) {
    // Simular búsqueda por RUT (retorna la orden más reciente del cliente)
    const clientesPorRut = {
        '12345678-9': 'ORD-2024-001',
        '98765432-1': 'ORD-2024-002',
        '11223344-5': 'ORD-2024-003'
    };
    
    const orden = clientesPorRut[rut];
    return orden ? obtenerDatosPorOrden(orden) : null;
}

function mostrarCargando(mostrar) {
    const boton = document.querySelector('#estadoForm button[type="submit"]');
    const resultadoDiv = document.getElementById('resultadoConsulta');
    const errorDiv = document.getElementById('mensajeError');
    
    if (mostrar) {
        boton.textContent = 'Consultando...';
        boton.disabled = true;
        resultadoDiv.style.display = 'none';
        errorDiv.style.display = 'none';
    } else {
        boton.textContent = 'Consultar Estado';
        boton.disabled = false;
    }
}

function mostrarResultado(datos) {
    // Llenar información básica
    document.getElementById('ordenNumero').textContent = datos.ordenNumero;
    document.getElementById('clienteNombre').textContent = datos.clienteNombre;
    document.getElementById('equipoDescripcion').textContent = datos.equipoDescripcion;
    document.getElementById('fechaIngreso').textContent = datos.fechaIngreso;
    document.getElementById('estadoActual').textContent = datos.estadoActual;
    document.getElementById('problemaDescripcion').textContent = datos.problemaDescripcion;

    // Actualizar notas del técnico
    const notasDiv = document.getElementById('notasTecnico');
    if (datos.notas) {
        notasDiv.innerHTML = `<p>${datos.notas}</p>`;
    } else {
        notasDiv.innerHTML = '<p>No hay notas adicionales por el momento.</p>';
    }

    // Actualizar timeline
    actualizarTimeline(datos.etapaActual);

    // Mostrar resultado y ocultar error
    document.getElementById('resultadoConsulta').style.display = 'block';
    document.getElementById('mensajeError').style.display = 'none';
    
    // Scroll suave hacia el resultado
    document.getElementById('resultadoConsulta').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function mostrarError() {
    document.getElementById('resultadoConsulta').style.display = 'none';
    document.getElementById('mensajeError').style.display = 'block';
    
    // Scroll suave hacia el mensaje de error
    document.getElementById('mensajeError').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function actualizarTimeline(etapaActual) {
    const etapas = ['diagnostico', 'reparacion', 'pruebas', 'finalizado'];
    let etapaIndex = etapas.indexOf(etapaActual);
    
    // Reiniciar todas las etapas
    etapas.forEach(etapa => {
        const elemento = document.getElementById(etapa);
        elemento.classList.remove('completed', 'current');
    });
    
    // Marcar etapas completadas y actual
    etapas.forEach((etapa, index) => {
        const elemento = document.getElementById(etapa);
        if (index < etapaIndex) {
            elemento.classList.add('completed');
        } else if (index === etapaIndex) {
            elemento.classList.add('completed', 'current');
        }
    });
}

// Función para validar formato de RUT (opcional)
function validarRut(rut) {
    // Expresión regular para RUT chileno
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    return rutRegex.test(rut);
}

// Función para formatear RUT mientras se escribe (opcional)
function formatearRut(input) {
    let valor = input.value.replace(/[^0-9kK]/g, '');
    if (valor.length > 1) {
        valor = valor.slice(0, -1) + '-' + valor.slice(-1);
    }
    input.value = valor;
}