import { useState, useEffect, useRef } from 'react';
import '../css/estilos.css';
import { validarRUT, formatearRUT, formatearTelefono } from '../utils/validaciones';
import { generarNumeroOrden } from '../utils/formatters';

function IngresarOrden() {
  // Estado del formulario
  const [form, setForm] = useState({
    clienteNombre: '', clienteRut: '', clienteTelefono: '', clienteEmail: '', clienteDireccion: '',
    equipoTipo: '', equipoMarca: '', equipoModelo: '', equipoSerial: '', equipoAccesorios: '',
    tipoServicio: '', prioridad: 'normal', problemaDescripcion: '', sintomas: '', observaciones: '',
    fechaEntrega: '', costoEstimado: '', garantia: false, abono: false, abonoCantidad: ''
  });

  const [repuestosNecesarios, setRepuestosNecesarios] = useState([]);
  const [repuestoInput, setRepuestoInput] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');
  
  const borradorInterval = useRef(null);

  // Cargar borrador si existe
  useEffect(() => {
    const borrador = localStorage.getItem('solicitud_borrador');
    if (borrador) {
      if (window.confirm('Se encontró un borrador guardado. ¿Deseas cargarlo?')) {
        const datos = JSON.parse(borrador);
        setForm({
          clienteNombre: datos.cliente?.nombre || '',
          clienteRut: datos.cliente?.rut || '',
          clienteTelefono: datos.cliente?.telefono || '',
          clienteEmail: datos.cliente?.email || '',
          clienteDireccion: datos.cliente?.direccion || '',
          equipoTipo: datos.equipo?.tipo || '',
          equipoMarca: datos.equipo?.marca || '',
          equipoModelo: datos.equipo?.modelo || '',
          equipoSerial: datos.equipo?.serial || '',
          equipoAccesorios: datos.equipo?.accesorios || '',
          tipoServicio: datos.servicio?.tipo || '',
          prioridad: datos.servicio?.prioridad || 'normal',
          problemaDescripcion: datos.servicio?.descripcion || '',
          sintomas: datos.servicio?.sintomas || '',
          observaciones: datos.servicio?.observaciones || '',
          fechaEntrega: datos.servicio?.fechaEntrega || '',
          costoEstimado: datos.servicio?.costoEstimado || '',
          garantia: datos.servicio?.garantia || false,
          abono: false,
          abonoCantidad: ''
        });
        setRepuestosNecesarios(datos.servicio?.repuestos || []);
      }
    }

    // Auto-guardar borrador cada 2 minutos
    borradorInterval.current = setInterval(() => {
      if (form.clienteNombre.trim()) {
        guardarBorrador();
      }
    }, 120000);

    return () => clearInterval(borradorInterval.current);
  }, []);

  // Configurar fecha mínima para entrega
  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    // (la restricción la aplicamos en el input directamente con min={hoy})
  }, []);

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleRutChange = (e) => {
    handleChange('clienteRut', formatearRUT(e.target.value));
  };

  const handleTelefonoChange = (e) => {
    handleChange('clienteTelefono', formatearTelefono(e.target.value));
  };

  const agregarRepuestoManual = () => {
    if (repuestoInput.trim()) {
      setRepuestosNecesarios(prev => [...prev, repuestoInput.trim()]);
      setRepuestoInput('');
    }
  };

  const eliminarRepuesto = (index) => {
    setRepuestosNecesarios(prev => prev.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    if (!form.clienteNombre.trim()) { alert('El nombre del cliente es obligatorio.'); return false; }
    if (!form.clienteRut.trim()) { alert('El RUT del cliente es obligatorio.'); return false; }
    if (!validarRUT(form.clienteRut)) { alert('El formato del RUT no es válido.'); return false; }
    if (!form.clienteTelefono.trim()) { alert('El teléfono del cliente es obligatorio.'); return false; }
    if (!form.equipoTipo) { alert('Debe seleccionar el tipo de equipo.'); return false; }
    if (!form.equipoMarca.trim()) { alert('La marca del equipo es obligatoria.'); return false; }
    if (!form.tipoServicio) { alert('Debe seleccionar el tipo de servicio.'); return false; }
    if (!form.problemaDescripcion.trim()) { alert('La descripción del problema es obligatoria.'); return false; }
    if (form.abono && (!form.abonoCantidad || parseFloat(form.abonoCantidad) < 0)) {
      alert('Debe ingresar un monto válido para el abono inicial.');
      return false;
    }
    return true;
  };

  const guardarBorrador = () => {
    const datos = obtenerDatosFormulario();
    localStorage.setItem('solicitud_borrador', JSON.stringify(datos));
  };

  const obtenerDatosFormulario = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logueado') || '{}');
    return {
      cliente: {
        nombre: form.clienteNombre.trim(),
        rut: form.clienteRut.trim(),
        telefono: form.clienteTelefono.trim(),
        email: form.clienteEmail.trim(),
        direccion: form.clienteDireccion.trim()
      },
      equipo: {
        tipo: form.equipoTipo,
        marca: form.equipoMarca.trim(),
        modelo: form.equipoModelo.trim(),
        serial: form.equipoSerial.trim(),
        accesorios: form.equipoAccesorios.trim()
      },
      servicio: {
        tipo: form.tipoServicio,
        prioridad: form.prioridad,
        descripcion: form.problemaDescripcion.trim(),
        sintomas: form.sintomas.trim(),
        observaciones: form.observaciones.trim(),
        fechaEntrega: form.fechaEntrega,
        costoEstimado: form.costoEstimado,
        garantia: form.garantia,
        repuestos: repuestosNecesarios,
        abono: form.abono ? parseFloat(form.abonoCantidad) : 0
      },
      fechaCreacion: new Date().toISOString(),
      usuario: usuario.username || 'desconocido'
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const datos = obtenerDatosFormulario();
    const numero = generarNumeroOrden();
    
    // Guardar solicitud
    let solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    datos.numeroOrden = numero;
    datos.estado = 'recibido';
    solicitudes.push(datos);
    localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudes));

    // Limpiar borrador
    localStorage.removeItem('solicitud_borrador');

    // Mostrar modal
    setNumeroOrden(numero);
    setModalConfirmacion(true);
  };

  const imprimirSolicitud = () => {
    alert(`Imprimiendo solicitud ${numeroOrden}...\n(Función de impresión pendiente de implementar)`);
  };

  const nuevaSolicitud = () => {
    setModalConfirmacion(false);
    setForm({
      clienteNombre: '', clienteRut: '', clienteTelefono: '', clienteEmail: '', clienteDireccion: '',
      equipoTipo: '', equipoMarca: '', equipoModelo: '', equipoSerial: '', equipoAccesorios: '',
      tipoServicio: '', prioridad: 'normal', problemaDescripcion: '', sintomas: '', observaciones: '',
      fechaEntrega: '', costoEstimado: '', garantia: false, abono: false, abonoCantidad: ''
    });
    setRepuestosNecesarios([]);
    setRepuestoInput('');
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <main>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>Información del Cliente</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clienteNombre">Nombre Completo*</label>
                <input type="text" value={form.clienteNombre} onChange={(e) => handleChange('clienteNombre', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="clienteRut">RUT*</label>
                <input type="text" placeholder="Ej: 12345678-9" value={form.clienteRut} onChange={handleRutChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clienteTelefono">Teléfono*</label>
                <input type="tel" placeholder="Ej: +56 9 1234 5678" value={form.clienteTelefono} onChange={handleTelefonoChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="clienteEmail">Correo Electrónico</label>
                <input type="email" value={form.clienteEmail} onChange={(e) => handleChange('clienteEmail', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="clienteDireccion">Dirección</label>
              <input type="text" value={form.clienteDireccion} onChange={(e) => handleChange('clienteDireccion', e.target.value)} />
            </div>
          </section>

          <section className="form-section">
            <h3>Información del Equipo</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="equipoTipo">Tipo de Equipo*</label>
                <select value={form.equipoTipo} onChange={(e) => handleChange('equipoTipo', e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  <option value="notebook">Notebook</option>
                  <option value="pc-escritorio">PC de Escritorio</option>
                  <option value="servidor">Servidor</option>
                  <option value="monitor">Monitor</option>
                  <option value="impresora">Impresora</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="equipoMarca">Marca*</label>
                <input type="text" value={form.equipoMarca} onChange={(e) => handleChange('equipoMarca', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="equipoModelo">Modelo</label>
                <input type="text" value={form.equipoModelo} onChange={(e) => handleChange('equipoModelo', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="equipoSerial">N° de Serie</label>
                <input type="text" value={form.equipoSerial} onChange={(e) => handleChange('equipoSerial', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="equipoAccesorios">Accesorios Incluidos</label>
              <textarea rows="2" placeholder="Ej: Cargador, mouse, teclado, etc." value={form.equipoAccesorios} onChange={(e) => handleChange('equipoAccesorios', e.target.value)}></textarea>
            </div>
          </section>

          <section className="form-section">
            <h3>Detalles del Servicio</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoServicio">Tipo de Servicio*</label>
                <select value={form.tipoServicio} onChange={(e) => handleChange('tipoServicio', e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  <option value="reparacion">Reparación</option>
                  <option value="mantencion">Mantención Preventiva</option>
                  <option value="actualizacion">Actualización de Componentes</option>
                  <option value="diagnostico">Solo Diagnóstico</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="prioridad">Prioridad*</label>
                <select value={form.prioridad} onChange={(e) => handleChange('prioridad', e.target.value)} required>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="problemaDescripcion">Descripción del Problema*</label>
              <textarea rows="4" value={form.problemaDescripcion} onChange={(e) => handleChange('problemaDescripcion', e.target.value)} required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="sintomas">Síntomas del equipo (ej: no enciende, se reinicia, etc.):</label>
              <textarea rows="3" value={form.sintomas} onChange={(e) => handleChange('sintomas', e.target.value)}></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="observaciones">Observaciones adicionales:</label>
              <textarea rows="3" value={form.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)}></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="repuestosNecesariosInput">Repuestos Necesarios (opcional):</label>
              <div className="input-with-button">
                <input type="text" placeholder="Ej: Placa madre B550, Disco SSD 500GB" value={repuestoInput} onChange={(e) => setRepuestoInput(e.target.value)} />
                <button type="button" className="btn-secondary" onClick={agregarRepuestoManual}>+</button>
              </div>
            </div>
            <div id="listaRepuestosNecesarios">
              {repuestosNecesarios.map((rep, i) => (
                <div key={i} className="repuesto-item" style={{ display: 'inline-block', margin: '0.5rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  {rep} <button type="button" onClick={() => eliminarRepuesto(i)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaEntrega">Fecha Estimada de Entrega</label>
                <input type="date" min={hoy} value={form.fechaEntrega} onChange={(e) => handleChange('fechaEntrega', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="costoEstimado">Costo Estimado ($)</label>
                <input type="number" min="0" value={form.costoEstimado} onChange={(e) => handleChange('costoEstimado', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="garantia">
                <input type="checkbox" checked={form.garantia} onChange={(e) => handleChange('garantia', e.target.checked)} /> ¿Es servicio de garantía?
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="abono">
                <input type="checkbox" checked={form.abono} onChange={(e) => handleChange('abono', e.target.checked)} /> Abono Inicial
              </label>
              {form.abono && (
                <div id="abonoCantidadGroup">
                  <label htmlFor="abonoCantidad">Monto del Abono ($)</label>
                  <input type="number" min="0" value={form.abonoCantidad} onChange={(e) => handleChange('abonoCantidad', e.target.value)} />
                </div>
              )}
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Ingresar Solicitud</button>
          </div>
        </form>
      </div>

      {modalConfirmacion && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>✅ Solicitud Ingresada Correctamente</h3>
            <p>El número de orden es: <span id="numeroOrdenGenerado">{numeroOrden}</span></p>
            <div className="modal-actions">
              <button onClick={imprimirSolicitud} className="btn-secondary">Imprimir</button>
              <button onClick={nuevaSolicitud} className="btn-primary">Ingresar Nueva Solicitud</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default IngresarOrden;