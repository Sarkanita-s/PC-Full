import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/estilos.css';

function Admin() {
  const [ordenesCambio, setOrdenesCambio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarOrdenesCambioPiezas();
  }, []);

  const cargarOrdenesCambioPiezas = () => {
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    const ordenesCambio = solicitudes.filter(s => {
      if (!s.falla) return false;
      const texto = s.falla.toLowerCase();
      return texto.includes('cambiar') || texto.includes('actualizar') || texto.includes('reemplazar');
    });
    setOrdenesCambio(ordenesCambio);
  };

  const extraerPiezasDeTexto = (texto) => {
    const piezas = ['procesador', 'memoria', 'ram', 'ssd', 'disco', 'placa', 'fuente', 'tarjeta', 'cable', 'ventilador', 'cooler', 'bateria', 'pantalla', 'teclado', 'mouse', 'refrigeracion', 'motherboard', 'video'];
    const textoLower = texto.toLowerCase();
    return piezas.filter(p => textoLower.includes(p));
  };

  const agregarRepuestosFaltantesAlCarrito = (numeroOrden) => {
    const solicitudes = JSON.parse(localStorage.getItem('solicitudes_guardadas') || '[]');
    const orden = solicitudes.find(s => s.numeroOrden === numeroOrden);
    
    if (!orden) {
      alert('Orden no encontrada.');
      return;
    }

    const piezas = extraerPiezasDeTexto(orden.falla || '');
    
    if (piezas.length === 0) {
      alert('No se detectaron piezas a cambiar en la descripción.');
      return;
    }

    let repuestos = JSON.parse(localStorage.getItem('repuestos_data') || '[]');
    let compras = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
    let agregados = [];

    piezas.forEach(pieza => {
      const repuesto = repuestos.find(r => r.nombre.toLowerCase().includes(pieza));
      if (!repuesto || repuesto.stock === 0) {
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
  };

  return (
    <main>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-number">24</div>
          <div className="admin-stat-label">Órdenes Activas</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">8</div>
          <div className="admin-stat-label">En Reparación</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">5</div>
          <div className="admin-stat-label">Esperando Repuestos</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">3</div>
          <div className="admin-stat-label">Listos para Entrega</div>
        </div>
      </div>

      <h2>Panel de Control</h2>
      <div className="admin-dashboard">
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">📋</span>
            <h3>Gestión de Órdenes</h3>
          </div>
          <p>Crear, editar y gestionar todas las órdenes de servicio del sistema.</p>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => navigate('/ingresar-orden')}>Gestionar Órdenes</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">👥</span>
            <h3>Gestión de Clientes</h3>
          </div>
          <p>Administrar información de clientes y historial de servicios.</p>
          <div className="card-footer">
            <button className="btn btn-primary">Ver Clientes</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">📦</span>
            <h3>Inventario</h3>
          </div>
          <p>Control de repuestos, stock y gestión de inventario.</p>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => navigate('/hard-repuestos')}>Ver Inventario</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">🏢</span>
            <h3>Proveedores</h3>
          </div>
          <p>Gestión de proveedores y órdenes de compra.</p>
          <div className="card-footer">
            <button className="btn btn-primary">Ver Proveedores</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">📊</span>
            <h3>Reportes</h3>
          </div>
          <p>Generar reportes financieros y estadísticas del servicio.</p>
          <div className="card-footer">
            <button className="btn btn-primary">Generar Reportes</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-icon">⚙️</span>
            <h3>Configuración</h3>
          </div>
          <p>Configuración del sistema y gestión de usuarios.</p>
          <div className="card-footer">
            <button className="btn btn-primary">Configurar</button>
          </div>
        </div>
      </div>

      {ordenesCambio.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>Órdenes que Requieren Cambio de Piezas</h2>
          <table className="tabla-repuestos">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Cliente</th>
                <th>Equipo</th>
                <th>Descripción Falla</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesCambio.map((orden, idx) => (
                <tr key={idx}>
                  <td>{orden.numeroOrden || ''}</td>
                  <td>{orden.clienteNombre || orden.cliente?.nombre || ''}</td>
                  <td>{orden.equipoMarca || orden.equipo?.marca || ''} {orden.equipoModelo || orden.equipo?.modelo || ''}</td>
                  <td>{orden.falla || ''}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => agregarRepuestosFaltantesAlCarrito(orden.numeroOrden)}
                    >
                      Agregar repuestos faltantes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Admin;