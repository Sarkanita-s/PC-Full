import { useState, useEffect } from 'react';
import '../css/estilos.css';

// Datos iniciales de ejemplo (se cargarán desde localStorage si existen)
const repuestosIniciales = [
  { codigo: 'CPU001', nombre: 'Intel Core i5-12400F', categoria: 'procesador', stock: 5, minimo: 10, precio: 180000, estado: 'critico', proveedor: 'TechSupply' },
  { codigo: 'RAM001', nombre: 'Kingston DDR4 8GB 3200MHz', categoria: 'memoria', stock: 0, minimo: 15, precio: 45000, estado: 'agotado', proveedor: 'MemoryPlus' },
  { codigo: 'SSD001', nombre: 'Samsung SSD 970 EVO 500GB', categoria: 'almacenamiento', stock: 12, minimo: 8, precio: 85000, estado: 'disponible', proveedor: 'StorageWorld' },
  { codigo: 'GPU001', nombre: 'NVIDIA RTX 3060 Ti', categoria: 'tarjeta-video', stock: 3, minimo: 5, precio: 350000, estado: 'critico', proveedor: 'GraphicsMax' },
  { codigo: 'PSU001', nombre: 'Corsair 650W 80+ Bronze', categoria: 'fuente', stock: 8, minimo: 6, precio: 95000, estado: 'disponible', proveedor: 'PowerComponents' },
  { codigo: 'MB001', nombre: 'ASUS B550M-A WiFi', categoria: 'placa-madre', stock: 6, minimo: 4, precio: 120000, estado: 'disponible', proveedor: 'BoardsTech' },
  { codigo: 'COOL001', nombre: 'Cooler Master Hyper 212', categoria: 'refrigeracion', stock: 0, minimo: 8, precio: 35000, estado: 'pedido', proveedor: 'CoolingPro' },
  { codigo: 'CABLE001', nombre: 'Cable SATA 3.0 50cm', categoria: 'cables', stock: 25, minimo: 20, precio: 3500, estado: 'disponible', proveedor: 'CableWorks' }
];

function HardRepuestos() {
  // Estados
  const [repuestos, setRepuestos] = useState([]);
  const [filtros, setFiltros] = useState({ categoria: '', estado: '', busqueda: '' });
  const [comprasSolicitadas, setComprasSolicitadas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formRepuesto, setFormRepuesto] = useState({
    codigo: '', nombre: '', categoria: '', proveedor: '', stock: 0, minimo: 0, precio: 0
  });
  const [formCompra, setFormCompra] = useState({ repuesto: '', proveedor: '', direccion: '', valor: '' });

  // Cargar datos desde localStorage al montar
  useEffect(() => {
    const datosGuardados = localStorage.getItem('repuestos_data');
    if (datosGuardados) {
      setRepuestos(JSON.parse(datosGuardados));
    } else {
      setRepuestos(repuestosIniciales);
    }

    const comprasGuardadas = localStorage.getItem('compras_solicitadas');
    if (comprasGuardadas) {
      setComprasSolicitadas(JSON.parse(comprasGuardadas));
    }
  }, []);

  // Persistir repuestos en localStorage cuando cambien
  useEffect(() => {
    if (repuestos.length > 0) {
      localStorage.setItem('repuestos_data', JSON.stringify(repuestos));
    }
  }, [repuestos]);

  // Persistir compras en localStorage
  useEffect(() => {
    localStorage.setItem('compras_solicitadas', JSON.stringify(comprasSolicitadas));
  }, [comprasSolicitadas]);

  // Filtrar repuestos
  const repuestosFiltrados = repuestos.filter(r => {
    const matchCategoria = !filtros.categoria || r.categoria === filtros.categoria;
    const matchEstado = !filtros.estado || r.estado === filtros.estado;
    const matchBusqueda = !filtros.busqueda ||
      r.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      r.codigo.toLowerCase().includes(filtros.busqueda.toLowerCase());
    return matchCategoria && matchEstado && matchBusqueda;
  });

  // Estadísticas
  const stats = {
    criticos: repuestos.filter(r => r.estado === 'critico').length,
    agotados: repuestos.filter(r => r.estado === 'agotado').length,
    pedidos: repuestos.filter(r => r.estado === 'pedido').length,
    total: repuestos.length
  };

  // Helpers
  const obtenerNombreCategoria = (cat) => {
    const nombres = {
      procesador: 'Procesadores', memoria: 'Memoria RAM', almacenamiento: 'Almacenamiento',
      'tarjeta-video': 'Tarjetas de Video', fuente: 'Fuentes de Poder', 'placa-madre': 'Placas Madre',
      refrigeracion: 'Refrigeración', cables: 'Cables y Conectores', otros: 'Otros'
    };
    return nombres[cat] || cat;
  };

  const obtenerNombreEstado = (est) => {
    const nombres = { disponible: 'Disponible', critico: 'Crítico', agotado: 'Agotado', pedido: 'En Pedido' };
    return nombres[est] || est;
  };

  const calcularEstado = (stock, minimo) => {
    if (stock === 0) return 'agotado';
    if (stock <= minimo) return 'critico';
    return 'disponible';
  };

  // Handlers - Filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({ categoria: '', estado: '', busqueda: '' });
  };

  // Handlers - Modal Repuesto
  const abrirModal = (repuesto = null) => {
    if (repuesto) {
      setFormRepuesto(repuesto);
      setModoEdicion(true);
    } else {
      setFormRepuesto({ codigo: '', nombre: '', categoria: '', proveedor: '', stock: 0, minimo: 0, precio: 0 });
      setModoEdicion(false);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFormRepuesto({ codigo: '', nombre: '', categoria: '', proveedor: '', stock: 0, minimo: 0, precio: 0 });
  };

  const handleFormRepuestoChange = (campo, valor) => {
    setFormRepuesto(prev => ({ ...prev, [campo]: valor }));
  };

  const guardarRepuesto = (e) => {
    e.preventDefault();
    const estado = calcularEstado(parseInt(formRepuesto.stock), parseInt(formRepuesto.minimo));
    const repuestoFinal = { ...formRepuesto, stock: parseInt(formRepuesto.stock), minimo: parseInt(formRepuesto.minimo), precio: parseFloat(formRepuesto.precio) || 0, estado };

    if (modoEdicion) {
      setRepuestos(prev => prev.map(r => r.codigo === repuestoFinal.codigo ? repuestoFinal : r));
    } else {
      setRepuestos(prev => [...prev, repuestoFinal]);
    }
    cerrarModal();
  };

  const marcarCritico = (codigo) => {
    setRepuestos(prev => prev.map(r => r.codigo === codigo ? { ...r, estado: 'critico' } : r));
    alert(`Repuesto ${codigo} marcado como crítico.`);
  };

  const solicitarCompra = (codigo) => {
    const repuesto = repuestos.find(r => r.codigo === codigo);
    if (!repuesto) return;

    const cantidad = prompt(`¿Cuántas unidades deseas solicitar de ${repuesto.nombre}?`, repuesto.minimo * 2);
    if (cantidad && parseInt(cantidad) > 0) {
      setRepuestos(prev => prev.map(r => r.codigo === codigo ? { ...r, estado: 'pedido' } : r));

      const comprasPendientes = JSON.parse(localStorage.getItem('compras_pendientes') || '[]');
      comprasPendientes.push({
        codigo: repuesto.codigo,
        nombre: repuesto.nombre,
        cantidad: parseInt(cantidad),
        proveedor: repuesto.proveedor,
        precio: repuesto.precio,
        total: repuesto.precio * parseInt(cantidad),
        fechaSolicitud: new Date().toISOString(),
        urgente: repuesto.estado === 'agotado' || repuesto.stock === 0
      });
      localStorage.setItem('compras_pendientes', JSON.stringify(comprasPendientes));
      alert(`Solicitud de compra creada: ${cantidad} unidades de ${repuesto.nombre}`);
    }
  };

  // Handlers - Compras Solicitadas
  const handleFormCompraChange = (campo, valor) => {
    setFormCompra(prev => ({ ...prev, [campo]: valor }));
  };

  const agregarRepuestoACompra = () => {
    if (!formCompra.repuesto.trim()) {
      alert('El nombre del repuesto es obligatorio.');
      return;
    }
    setComprasSolicitadas(prev => [...prev, { ...formCompra, valor: parseFloat(formCompra.valor) || 0 }]);
    setFormCompra({ repuesto: '', proveedor: '', direccion: '', valor: '' });
  };

  const limpiarFormularioCompra = () => {
    setFormCompra({ repuesto: '', proveedor: '', direccion: '', valor: '' });
  };

  const editarItemCompra = (index) => {
    setFormCompra(comprasSolicitadas[index]);
    eliminarItemCompra(index);
  };

  const eliminarItemCompra = (index) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este repuesto de la lista?')) {
      setComprasSolicitadas(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <main>
      <div className="hardware-container">
        <div className="hardware-header">
          <h1>Gestión de Hardware y Repuestos</h1>
          <p>Control de inventario, repuestos críticos y compras pendientes</p>
        </div>

        <div className="filtros-section">
          <div className="filtros-container">
            <div className="filtro-group">
              <label htmlFor="filtroCategoria">Categoría:</label>
              <select value={filtros.categoria} onChange={(e) => handleFiltroChange('categoria', e.target.value)}>
                <option value="">Todas</option>
                <option value="procesador">Procesadores</option>
                <option value="memoria">Memoria RAM</option>
                <option value="almacenamiento">Almacenamiento</option>
                <option value="tarjeta-video">Tarjetas de Video</option>
                <option value="fuente">Fuentes de Poder</option>
                <option value="placa-madre">Placas Madre</option>
                <option value="refrigeracion">Refrigeración</option>
                <option value="cables">Cables y Conectores</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div className="filtro-group">
              <label htmlFor="filtroEstado">Estado:</label>
              <select value={filtros.estado} onChange={(e) => handleFiltroChange('estado', e.target.value)}>
                <option value="">Todos</option>
                <option value="disponible">Disponible</option>
                <option value="critico">Crítico</option>
                <option value="agotado">Agotado</option>
                <option value="pedido">En Pedido</option>
              </select>
            </div>

            <div className="filtro-group">
              <label htmlFor="busqueda">Buscar:</label>
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              />
            </div>

            <button onClick={limpiarFiltros} className="btn-secondary">Limpiar Filtros</button>
          </div>
        </div>

        <div className="stats-hardware">
          <div className="stat-card critico">
            <h4>Repuestos Críticos</h4>
            <div className="stat-number">{stats.criticos}</div>
            <p>Requieren compra urgente</p>
          </div>
          <div className="stat-card agotado">
            <h4>Agotados</h4>
            <div className="stat-number">{stats.agotados}</div>
            <p>Sin stock disponible</p>
          </div>
          <div className="stat-card pedido">
            <h4>En Pedido</h4>
            <div className="stat-number">{stats.pedidos}</div>
            <p>Compras en proceso</p>
          </div>
          <div className="stat-card total">
            <h4>Total Items</h4>
            <div className="stat-number">{stats.total}</div>
            <p>En inventario</p>
          </div>
        </div>

        <div className="tabla-container">
          <button onClick={() => abrirModal()} className="btn-primary" style={{ marginBottom: '1rem' }}>+ Agregar Repuesto</button>
          <table className="tabla-hardware">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {repuestosFiltrados.map(r => (
                <tr key={r.codigo} className={`estado-${r.estado}`}>
                  <td>{r.codigo}</td>
                  <td>{r.nombre}</td>
                  <td>{obtenerNombreCategoria(r.categoria)}</td>
                  <td className={r.stock <= r.minimo ? 'stock-bajo' : ''}>{r.stock}</td>
                  <td>{r.minimo}</td>
                  <td>${r.precio.toLocaleString('es-CL')}</td>
                  <td><span className={`badge badge-${r.estado}`}>{obtenerNombreEstado(r.estado)}</span></td>
                  <td>{r.proveedor}</td>
                  <td className="acciones">
                    <button onClick={() => abrirModal(r)} className="btn-icon" title="Editar">✏️</button>
                    <button onClick={() => marcarCritico(r.codigo)} className="btn-icon" title="Marcar como crítico">⚠️</button>
                    <button onClick={() => solicitarCompra(r.codigo)} className="btn-icon" title="Solicitar compra">🛒</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compras-section">
          <h3>🛒 Repuestos Solicitados para Compra</h3>
          <p>Usa este formulario para agregar los repuestos que necesitan ser comprados. Puedes editar o eliminar los elementos de la lista.</p>

          <div className="form-section form-inline">
            <input type="text" placeholder="Nombre del Repuesto" value={formCompra.repuesto} onChange={(e) => handleFormCompraChange('repuesto', e.target.value)} />
            <input type="text" placeholder="Proveedor" value={formCompra.proveedor} onChange={(e) => handleFormCompraChange('proveedor', e.target.value)} />
            <input type="text" placeholder="Dirección" value={formCompra.direccion} onChange={(e) => handleFormCompraChange('direccion', e.target.value)} />
            <input type="number" placeholder="Valor ($)" min="0" value={formCompra.valor} onChange={(e) => handleFormCompraChange('valor', e.target.value)} />
            <button type="button" className="btn-primary" onClick={agregarRepuestoACompra}>Agregar</button>
            <button type="button" className="btn-secondary" onClick={limpiarFormularioCompra}>Limpiar</button>
          </div>

          <div className="tabla-container">
            <table className="tabla-hardware">
              <thead>
                <tr>
                  <th>Repuesto</th>
                  <th>Proveedor</th>
                  <th>Dirección</th>
                  <th>Valor ($)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comprasSolicitadas.map((c, i) => (
                  <tr key={i}>
                    <td>{c.repuesto}</td>
                    <td>{c.proveedor}</td>
                    <td>{c.direccion}</td>
                    <td>{c.valor ? `$${c.valor.toLocaleString('es-CL')}` : ''}</td>
                    <td className="acciones">
                      <button onClick={() => editarItemCompra(i)} className="btn-icon" title="Editar">✏️</button>
                      <button onClick={() => eliminarItemCompra(i)} className="btn-icon" title="Eliminar">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalAbierto && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>{modoEdicion ? 'Editar Repuesto' : 'Agregar Nuevo Repuesto'}</h3>
            <form onSubmit={guardarRepuesto}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modalCodigo">Código*</label>
                  <input type="text" id="modalCodigo" value={formRepuesto.codigo} onChange={(e) => handleFormRepuestoChange('codigo', e.target.value)} readOnly={modoEdicion} required />
                </div>
                <div className="form-group">
                  <label htmlFor="modalNombre">Nombre del Producto*</label>
                  <input type="text" id="modalNombre" value={formRepuesto.nombre} onChange={(e) => handleFormRepuestoChange('nombre', e.target.value)} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modalCategoria">Categoría*</label>
                  <select id="modalCategoria" value={formRepuesto.categoria} onChange={(e) => handleFormRepuestoChange('categoria', e.target.value)} required>
                    <option value="">Seleccionar...</option>
                    <option value="procesador">Procesadores</option>
                    <option value="memoria">Memoria RAM</option>
                    <option value="almacenamiento">Almacenamiento</option>
                    <option value="tarjeta-video">Tarjetas de Video</option>
                    <option value="fuente">Fuentes de Poder</option>
                    <option value="placa-madre">Placas Madre</option>
                    <option value="refrigeracion">Refrigeración</option>
                    <option value="cables">Cables y Conectores</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="modalProveedor">Proveedor</label>
                  <input type="text" id="modalProveedor" value={formRepuesto.proveedor} onChange={(e) => handleFormRepuestoChange('proveedor', e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modalStock">Stock Actual*</label>
                  <input type="number" id="modalStock" min="0" value={formRepuesto.stock} onChange={(e) => handleFormRepuestoChange('stock', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="modalMinimo">Stock Mínimo*</label>
                  <input type="number" id="modalMinimo" min="0" value={formRepuesto.minimo} onChange={(e) => handleFormRepuestoChange('minimo', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="modalPrecio">Precio ($)</label>
                <input type="number" id="modalPrecio" min="0" step="0.01" value={formRepuesto.precio} onChange={(e) => handleFormRepuestoChange('precio', e.target.value)} />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={cerrarModal} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default HardRepuestos;