import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/estilos.css';

const usuarios = {
  'admin': { password: 'admin123', role: 'admin' },
  'ventas': { password: 'ventas123', role: 'ventas' },
  'vendedor1': { password: 'venta123', role: 'ventas' },
  'sofia': { password: 'sofia123', role: 'ventas' },
  'cliente': { password: 'cliente123', role: 'client' }
};

function Sesion() {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const navigate = useNavigate();

  const handleChange = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 4000);
  };

  const limpiarSesionCompleta = () => {
    localStorage.removeItem('usuario_logueado');
    localStorage.removeItem('solicitud_borrador');
    localStorage.removeItem('solicitudes_guardadas');
    localStorage.removeItem('repuestos_data');
    localStorage.removeItem('compras_pendientes');
    mostrarAlerta('Sesión limpiada. Intenta iniciar sesión nuevamente.', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password || !form.role) {
      mostrarAlerta('Por favor completa todos los campos', 'error');
      return;
    }

    setCargando(true);

    setTimeout(() => {
      const usuario = usuarios[form.username.toLowerCase()];

      if (usuario && usuario.password === form.password && usuario.role === form.role) {
        localStorage.setItem('usuario_logueado', JSON.stringify({
          username: form.username,
          role: form.role,
          loginTime: new Date().toISOString()
        }));

        mostrarAlerta('¡Acceso concedido! Redirigiendo...', 'success');
        setCargando(false);

        setTimeout(() => {
          switch (form.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'ventas':
              navigate('/menu-ventas');
              break;
            case 'client':
              navigate('/estado-equipo');
              break;
            default:
              mostrarAlerta('Tipo de usuario no válido', 'error');
          }
        }, 1500);
      } else {
        setCargando(false);
        mostrarAlerta('Usuario, contraseña o tipo de acceso incorrectos', 'error');
        setForm(prev => ({ ...prev, password: '' }));
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span style={{ fontSize: '6rem' }}>💻</span>
          <h2>PC Full - Iniciar Sesión</h2>
        </div>

        {alerta && (
          <div className={`alert alert-${alerta.tipo}`}>
            {alerta.mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ opacity: cargando ? 0.7 : 1 }}>
          <div className="form-group">
            <label htmlFor="username">Usuario:</label>
            <input type="text" value={form.username} onChange={(e) => handleChange('username', e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Tipo de acceso:</label>
            <select value={form.role} onChange={(e) => handleChange('role', e.target.value)} required>
              <option value="">Seleccionar tipo...</option>
              <option value="admin">Administrador</option>
              <option value="ventas">Equipo de Ventas</option>
              <option value="client">Cliente</option>
            </select>
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="login-links">
          <p>
            <Link to="/">Volver al sitio público</Link>
          </p>
          <p>
            ¿Problemas de acceso?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); limpiarSesionCompleta(); }}>
              Limpiar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sesion;