import { useState } from 'react';
import '../css/estilos.css';

const ordenesDB = {
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

const clientesPorRut = {
  '12345678-9': 'ORD-2024-001',
  '98765432-1': 'ORD-2024-002',
  '11223344-5': 'ORD-2024-003'
};

function EstadoEquipo() {
  const [tipoConsulta, setTipoConsulta] = useState('');
  const [numeroOrden, setNumeroOrden] = useState('');
  const [rut, setRut] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [mostrarError, setMostrarError] = useState(false);

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    setTipoConsulta(tipo);
    setNumeroOrden('');
    setRut('');
    setResultado(null);
    setMostrarError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    consultarEstado();
  };

  const consultarEstado = () => {
    setCargando(true);
    setResultado(null);
    setMostrarError(false);

    setTimeout(() => {
      let datos = null;

      if (tipoConsulta === 'orden') {
        datos = ordenesDB[numeroOrden.toUpperCase()];
      } else if (tipoConsulta === 'rut') {
        const orden = clientesPorRut[rut];
        datos = orden ? ordenesDB[orden] : null;
      }

      setCargando(false);

      if (datos) {
        setResultado(datos);
        setMostrarError(false);
      } else {
        setResultado(null);
        setMostrarError(true);
      }
    }, 1500);
  };

  const obtenerClaseTimeline = (etapa) => {
    if (!resultado) return '';
    
    const etapas = ['diagnostico', 'reparacion', 'pruebas', 'finalizado'];
    const etapaIndex = etapas.indexOf(resultado.etapaActual);
    const actualIndex = etapas.indexOf(etapa);

    if (actualIndex < etapaIndex) return 'completed';
    if (actualIndex === etapaIndex) return 'completed current';
    return '';
  };

  return (
    <main>
      <section className="estado-equipo-section">
        <div className="container">
          <h1>Consultar Estado del Equipo</h1>
          <p>Ingresa tu número de orden o RUT para consultar el estado de tu equipo</p>

          <div className="consulta-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tipoConsulta">Tipo de consulta:</label>
                <select 
                  id="tipoConsulta" 
                  value={tipoConsulta} 
                  onChange={handleTipoChange} 
                  required
                >
                  <option value="">Selecciona una opción</option>
                  <option value="orden">Número de Orden</option>
                  <option value="rut">RUT del Cliente</option>
                </select>
              </div>

              {tipoConsulta === 'orden' && (
                <div className="form-group">
                  <label htmlFor="numeroOrden">Número de Orden:</label>
                  <input
                    type="text"
                    id="numeroOrden"
                    value={numeroOrden}
                    onChange={(e) => setNumeroOrden(e.target.value)}
                    placeholder="Ej: ORD-2024-001"
                    required
                  />
                </div>
              )}

              {tipoConsulta === 'rut' && (
                <div className="form-group">
                  <label htmlFor="rut">RUT (sin puntos, con guión):</label>
                  <input
                    type="text"
                    id="rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="Ej: 12345678-9"
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={cargando}>
                {cargando ? 'Consultando...' : 'Consultar Estado'}
              </button>
            </form>
          </div>

          {resultado && (
            <div className="resultado-estado">
              <div className="estado-card">
                <h3>Estado del Equipo</h3>
                <div className="info-equipo">
                  <p><strong>Número de Orden:</strong> {resultado.ordenNumero}</p>
                  <p><strong>Cliente:</strong> {resultado.clienteNombre}</p>
                  <p><strong>Equipo:</strong> {resultado.equipoDescripcion}</p>
                  <p><strong>Fecha de Ingreso:</strong> {resultado.fechaIngreso}</p>
                  <p><strong>Estado Actual:</strong> <span className="estado-badge">{resultado.estadoActual}</span></p>
                  <p><strong>Descripción del Problema:</strong> {resultado.problemaDescripcion}</p>
                </div>

                <div className="progreso-reparacion">
                  <h4>Progreso de Reparación</h4>
                  <div className="timeline">
                    <div className="timeline-item completed">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>Recepción del Equipo</h5>
                        <p>Equipo recibido y registrado en sistema</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${obtenerClaseTimeline('diagnostico')}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>Diagnóstico</h5>
                        <p>Evaluación del problema reportado</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${obtenerClaseTimeline('reparacion')}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>Reparación</h5>
                        <p>Trabajo técnico en progreso</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${obtenerClaseTimeline('pruebas')}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>Pruebas</h5>
                        <p>Verificación de funcionamiento</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${obtenerClaseTimeline('finalizado')}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>Listo para Entrega</h5>
                        <p>Equipo reparado y listo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="notas-tecnico">
                  <h4>Notas del Técnico</h4>
                  <div>
                    <p>{resultado.notas || 'No hay notas adicionales por el momento.'}</p>
                  </div>
                </div>

                <div className="contacto-info">
                  <p><strong>¿Tienes preguntas?</strong> Contáctanos por WhatsApp o teléfono para más información.</p>
                </div>
              </div>
            </div>
          )}

          {mostrarError && (
            <div className="mensaje-error">
              <p>No se encontró información para los datos ingresados. Verifica que el número de orden o RUT sean correctos.</p>
              <p>Si el problema persiste, contáctanos directamente.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default EstadoEquipo;