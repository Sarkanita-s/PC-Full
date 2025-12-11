import { useState } from 'react';
import '../css/estilos.css';
import { supabase } from '../utils/supabase';

function EstadoEquipo() {

  const [busqueda, setBusqueda] = useState('');
  const [ordenEncontrada, setOrdenEncontrada] = useState(null);

  const buscarOrden = async () => {
    try {
      // Extraer el ID de la orden (ej: ORD-123 -> 123)
      const ordenId = busqueda.trim().replace(/\D/g, '');
      
      if (!ordenId) {
        alert('Formato de orden inválido');
        return;
      }

      const { data, error } = await supabase
        .from('ordenes')
        .select(`
          id,
          fecha_ingreso,
          fecha_entrega,
          total,
          equipos (
            id,
            tipo,
            marca,
            modelo,
            descripcion_problema,
            estado,
            clientes (
              nombre,
              telefono,
              email
            )
          )
        `)
        .eq('id', ordenId)
        .single();

      if (error || !data) {
        setOrdenEncontrada(null);
        alert('No existe una orden con ese número.');
        return;
      }

      // Mapear a formato esperado
      setOrdenEncontrada({
        numeroOrden: `ORD-${data.id}`,
        cliente: {
          nombre: data.equipos.clientes.nombre,
          telefono: data.equipos.clientes.telefono
        },
        equipo: {
          tipo: data.equipos.tipo,
          marca: data.equipos.marca,
          modelo: data.equipos.modelo || 'N/A'
        },
        estadoActual: data.equipos.estado,
        etapaActual: data.equipos.estado
      });

    } catch (error) {
      console.error('Error al buscar orden:', error);
      alert('Error al buscar la orden');
    }
  };

  return (
    <main>
      <div className="buscador">
        <input
          type="text"
          placeholder="Ej: ORD-2024-001"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button onClick={buscarOrden} className="btn-primary">Buscar</button>
      </div>

      {ordenEncontrada && (
        <div className="orden-detalle">
          <h2>Orden: {ordenEncontrada.numeroOrden}</h2>

          <h3>Cliente</h3>
          <p><b>Nombre:</b> {ordenEncontrada.cliente.nombre}</p>
          <p><b>Teléfono:</b> {ordenEncontrada.cliente.telefono}</p>

          <h3>Equipo</h3>
          <p><b>Tipo:</b> {ordenEncontrada.equipo.tipo}</p>
          <p><b>Marca:</b> {ordenEncontrada.equipo.marca}</p>
          <p><b>Modelo:</b> {ordenEncontrada.equipo.modelo}</p>

          <h3>Estado</h3>
          <p><b>Estado Actual:</b> {ordenEncontrada.estadoActual}</p>
          <p><b>Etapa:</b> {ordenEncontrada.etapaActual}</p>
        </div>
      )}
    </main>
  );
}

export default EstadoEquipo;
