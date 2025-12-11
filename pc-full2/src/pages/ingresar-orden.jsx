import { useState, useEffect, useRef } from 'react';
import '../css/estilos.css';
import { validarRUT, formatearRUT, formatearTelefono } from '../utils/validaciones';
import { generarNumeroOrden } from '../utils/formatters';
import { supabase } from '../utils/supabase';

function IngresarOrden() {

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

  // Cargar borrador
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

    borradorInterval.current = setInterval(() => {
      if (form.clienteNombre.trim()) guardarBorrador();
    }, 120000);

    return () => clearInterval(borradorInterval.current);
  }, []);

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleRutChange = e => handleChange('clienteRut', formatearRUT(e.target.value));
  const handleTelefonoChange = e => handleChange('clienteTelefono', formatearTelefono(e.target.value));

  const agregarRepuestoManual = () => {
    if (repuestoInput.trim()) {
      setRepuestosNecesarios(prev => [...prev, repuestoInput.trim()]);
      setRepuestoInput('');
    }
  };

  const eliminarRepuesto = i => {
    setRepuestosNecesarios(prev => prev.filter((_, index) => index !== i));
  };

  const validarFormulario = () => {
    if (!form.clienteNombre.trim()) return alert('El nombre del cliente es obligatorio.');
    if (!form.clienteRut.trim()) return alert('El RUT del cliente es obligatorio.');
    if (!validarRUT(form.clienteRut)) return alert('El RUT no es válido.');
    if (!form.clienteTelefono.trim()) return alert('El teléfono del cliente es obligatorio.');
    if (!form.equipoTipo) return alert('Debe seleccionar el tipo de equipo.');
    if (!form.equipoMarca.trim()) return alert('La marca del equipo es obligatoria.');
    if (!form.tipoServicio) return alert('Debe seleccionar el tipo de servicio.');
    if (!form.problemaDescripcion.trim()) return alert('Debe ingresar una descripción del problema.');
    return true;
  };

  const obtenerDatosFormulario = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logueado') || '{}');

    return {
      numeroOrden: '', // se llena luego
      cliente: {
        nombre: form.clienteNombre,
        rut: form.clienteRut,
        telefono: form.clienteTelefono,
        email: form.clienteEmail,
        direccion: form.clienteDireccion
      },
      equipo: {
        tipo: form.equipoTipo,
        marca: form.equipoMarca,
        modelo: form.equipoModelo,
        serial: form.equipoSerial,
        accesorios: form.equipoAccesorios
      },
      servicio: {
        tipo: form.tipoServicio,
        prioridad: form.prioridad,
        descripcion: form.problemaDescripcion,
        sintomas: form.sintomas,
        observaciones: form.observaciones,
        fechaEntrega: form.fechaEntrega,
        costoEstimado: form.costoEstimado,
        garantia: form.garantia,
        repuestos: repuestosNecesarios,
        abono: form.abono ? parseFloat(form.abonoCantidad) : 0
      },
      estadoActual: 'recibido',
      etapaActual: 'ingresado',
      fechaIngreso: new Date().toISOString(),
      usuario: usuario.username || 'desconocido'
    };
  };

  const guardarBorrador = () => {
    const datos = obtenerDatosFormulario();
    localStorage.setItem('solicitud_borrador', JSON.stringify(datos));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // 1. Insertar cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nombre: form.clienteNombre,
          telefono: form.clienteTelefono,
          email: form.clienteEmail || null
        })
        .select()
        .single();

      if (clienteError) throw clienteError;

      // 2. Insertar equipo
      const { data: equipoData, error: equipoError } = await supabase
        .from('equipos')
        .insert({
          cliente_id: clienteData.id,
          tipo: form.equipoTipo,
          marca: form.equipoMarca,
          modelo: form.equipoModelo || null,
          descripcion_problema: form.problemaDescripcion,
          estado: 'recibido'
        })
        .select()
        .single();

      if (equipoError) throw equipoError;

      // 3. Insertar orden
      const { data: ordenData, error: ordenError } = await supabase
        .from('ordenes')
        .insert({
          equipo_id: equipoData.id,
          fecha_ingreso: new Date().toISOString(),
          fecha_entrega: form.fechaEntrega || null,
          costo_mano_obra: parseFloat(form.costoEstimado) || 0,
          total: parseFloat(form.costoEstimado) || 0
        })
        .select()
        .single();

      if (ordenError) throw ordenError;

      // 4. Insertar repuestos si hay
      if (repuestosNecesarios.length > 0) {
        const repuestosInsert = repuestosNecesarios.map(nombre => ({
          orden_id: ordenData.id,
          repuesto_id: null, // Se puede mejorar buscando en tabla repuestos
          cantidad: 1
        }));

        const { error: repuestosError } = await supabase
          .from('orden_repuesto')
          .insert(repuestosInsert);

        if (repuestosError) console.error('Error insertando repuestos:', repuestosError);
      }

      localStorage.removeItem('solicitud_borrador');
      setNumeroOrden(`ORD-${ordenData.id}`);
      setModalConfirmacion(true);

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la solicitud: ' + error.message);
    }
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
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <main>
      <h1>Ingresar Nueva Solicitud de Servicio</h1>

      <form onSubmit={handleSubmit} className="formulario-orden">
        
        {/* Datos del Cliente */}
        <section className="seccion-formulario">
          <h2>Datos del Cliente</h2>
          
          <div className="form-group">
            <label htmlFor="clienteNombre">Nombre Completo *</label>
            <input
              type="text"
              id="clienteNombre"
              value={form.clienteNombre}
              onChange={(e) => handleChange('clienteNombre', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clienteRut">RUT *</label>
              <input
                type="text"
                id="clienteRut"
                value={form.clienteRut}
                onChange={handleRutChange}
                placeholder="12.345.678-9"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clienteTelefono">Teléfono *</label>
              <input
                type="tel"
                id="clienteTelefono"
                value={form.clienteTelefono}
                onChange={handleTelefonoChange}
                placeholder="+56 9 1234 5678"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clienteEmail">Email</label>
              <input
                type="email"
                id="clienteEmail"
                value={form.clienteEmail}
                onChange={(e) => handleChange('clienteEmail', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="clienteDireccion">Dirección</label>
              <input
                type="text"
                id="clienteDireccion"
                value={form.clienteDireccion}
                onChange={(e) => handleChange('clienteDireccion', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Datos del Equipo */}
        <section className="seccion-formulario">
          <h2>Datos del Equipo</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="equipoTipo">Tipo de Equipo *</label>
              <select
                id="equipoTipo"
                value={form.equipoTipo}
                onChange={(e) => handleChange('equipoTipo', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="notebook">Notebook</option>
                <option value="pc-escritorio">PC de Escritorio</option>
                <option value="impresora">Impresora</option>
                <option value="monitor">Monitor</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="equipoMarca">Marca *</label>
              <input
                type="text"
                id="equipoMarca"
                value={form.equipoMarca}
                onChange={(e) => handleChange('equipoMarca', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="equipoModelo">Modelo</label>
              <input
                type="text"
                id="equipoModelo"
                value={form.equipoModelo}
                onChange={(e) => handleChange('equipoModelo', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="equipoSerial">Número de Serie</label>
              <input
                type="text"
                id="equipoSerial"
                value={form.equipoSerial}
                onChange={(e) => handleChange('equipoSerial', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="equipoAccesorios">Accesorios Incluidos</label>
            <textarea
              id="equipoAccesorios"
              value={form.equipoAccesorios}
              onChange={(e) => handleChange('equipoAccesorios', e.target.value)}
              placeholder="Ej: Cargador, mouse, estuche, etc."
              rows="2"
            ></textarea>
          </div>
        </section>

        {/* Detalles del Servicio */}
        <section className="seccion-formulario">
          <h2>Detalles del Servicio</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoServicio">Tipo de Servicio *</label>
              <select
                id="tipoServicio"
                value={form.tipoServicio}
                onChange={(e) => handleChange('tipoServicio', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="reparacion">Reparación</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="instalacion">Instalación</option>
                <option value="actualizacion">Actualización</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prioridad">Prioridad</label>
              <select
                id="prioridad"
                value={form.prioridad}
                onChange={(e) => handleChange('prioridad', e.target.value)}
              >
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="problemaDescripcion">Descripción del Problema *</label>
            <textarea
              id="problemaDescripcion"
              value={form.problemaDescripcion}
              onChange={(e) => handleChange('problemaDescripcion', e.target.value)}
              placeholder="Describa el problema o motivo de ingreso"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="sintomas">Síntomas Adicionales</label>
            <textarea
              id="sintomas"
              value={form.sintomas}
              onChange={(e) => handleChange('sintomas', e.target.value)}
              placeholder="Detalles adicionales sobre el problema"
              rows="2"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              value={form.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              placeholder="Cualquier información adicional relevante"
              rows="2"
            ></textarea>
          </div>

          {/* Repuestos */}
          <div className="form-group">
            <label>Repuestos Necesarios</label>
            <div className="repuestos-input">
              <input
                type="text"
                value={repuestoInput}
                onChange={(e) => setRepuestoInput(e.target.value)}
                placeholder="Agregar repuesto..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarRepuestoManual())}
              />
              <button type="button" onClick={agregarRepuestoManual} className="btn-secondary">
                Agregar
              </button>
            </div>
            {repuestosNecesarios.length > 0 && (
              <ul className="lista-repuestos">
                {repuestosNecesarios.map((rep, i) => (
                  <li key={i}>
                    {rep}
                    <button type="button" onClick={() => eliminarRepuesto(i)} className="btn-eliminar">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaEntrega">Fecha Estimada de Entrega</label>
              <input
                type="date"
                id="fechaEntrega"
                value={form.fechaEntrega}
                onChange={(e) => handleChange('fechaEntrega', e.target.value)}
                min={hoy}
              />
            </div>

            <div className="form-group">
              <label htmlFor="costoEstimado">Costo Estimado ($)</label>
              <input
                type="number"
                id="costoEstimado"
                value={form.costoEstimado}
                onChange={(e) => handleChange('costoEstimado', e.target.value)}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.garantia}
                  onChange={(e) => handleChange('garantia', e.target.checked)}
                />
                Equipo en Garantía
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={form.abono}
                  onChange={(e) => handleChange('abono', e.target.checked)}
                />
                Solicitar Abono
              </label>
            </div>
          </div>

          {form.abono && (
            <div className="form-group">
              <label htmlFor="abonoCantidad">Monto del Abono ($)</label>
              <input
                type="number"
                id="abonoCantidad"
                value={form.abonoCantidad}
                onChange={(e) => handleChange('abonoCantidad', e.target.value)}
                min="0"
                step="1000"
              />
            </div>
          )}
        </section>

        <div className="form-actions">
          <button type="button" onClick={guardarBorrador} className="btn-secondary">
            Guardar Borrador
          </button>
          <button type="submit" className="btn-primary">
            Ingresar Solicitud
          </button>
        </div>
      </form>

      {modalConfirmacion && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>✅ Solicitud ingresada correctamente</h3>
            <p>Número de orden: <b>{numeroOrden}</b></p>
            <button onClick={nuevaSolicitud} className="btn-primary">Ingresar nueva</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default IngresarOrden;
