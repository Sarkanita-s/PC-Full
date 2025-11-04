import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/estilos.css';

function MenuVentas() {
    const [usuario, setUsuario] = useState('Usuario');
    const [fecha, setFecha] = useState('');
    const [stats, setStats] = useState({
        solicitudesPendientes: '--',
        repuestosCriticos: '--',
        ordenesHoy: '--'
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar usuario desde localStorage
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        if (usuarioLogueado) {
            const userData = JSON.parse(usuarioLogueado);
            setUsuario(userData.username);
        } else {
            setUsuario('Usuario Demo');
        }

        // Mostrar fecha actual
        const ahora = new Date();
        const fechaFormateada = ahora.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setFecha(fechaFormateada);

        // Cargar estadísticas
        setTimeout(() => {
            setStats({
                solicitudesPendientes: '12',
                repuestosCriticos: '3',
                ordenesHoy: '5'
            });
        }, 1000);

        // Actualizar estadísticas cada 5 minutos
        const interval = setInterval(() => {
            setStats({
                solicitudesPendientes: '12',
                repuestosCriticos: '3',
                ordenesHoy: '5'
            });
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const cerrarSesion = () => {
        if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
            localStorage.removeItem('usuario_logueado');
            alert('Sesión cerrada exitosamente.');
            navigate('/login');
        }
    };

    const mostrarProximamente = (modulo) => {
        alert(`El módulo "${modulo}" estará disponible próximamente.\n\nEstamos trabajando para implementar esta funcionalidad.`);
    };

    const mostrarAyuda = () => {
        const ayuda = `
=== AYUDA DEL SISTEMA ===

🏠 MENÚ PRINCIPAL:
• Ingreso de Solicitudes: Registrar nuevos servicios
• Gestión de Hardware: Ver repuestos y compras
• Reportes: Estadísticas (próximamente)
• Clientes: Base de datos (próximamente)

📝 INGRESO DE SOLICITUDES:
• Completar datos del cliente
• Describir el problema del equipo
• Seleccionar tipo de servicio
• Generar número de orden

🔧 GESTIÓN DE HARDWARE:
• Ver repuestos disponibles
• Marcar repuestos como críticos
• Gestionar compras pendientes

⚠️ IMPORTANTE:
• Las sesiones expiran después de 8 horas
• Guardar cambios antes de salir
• Contactar al administrador ante problemas

📞 SOPORTE:
• Email: soporte@pcfull.com
• Teléfono: +56 9 XXXX XXXX
`;
        alert(ayuda);
    };

    return (
        <main>
            <div className="menu-ventas-container">
                <div className="menu-header">
                    <h1>Sistema de Gestión PC Full</h1>
                    <p>Panel de control para el equipo de ventas</p>
                </div>

                <div className="user-info">
                    <div>
                        <strong>Bienvenido:</strong> <span>{usuario}</span> | <span>{fecha}</span>
                    </div>
                    <button className="logout-btn" onClick={cerrarSesion}>Cerrar Sesión</button>
                </div>

                <div className="menu-grid">
                    <div className="menu-item disponible" onClick={() => navigate('/ingresar-orden')}>
                        <div className="icon">📝</div>
                        <h3>Ingreso de Solicitudes</h3>
                        <p>Registrar nuevas solicitudes de servicio técnico. Gestionar información de clientes y equipos.</p>
                    </div>

                    <div className="menu-item disponible" onClick={() => navigate('/hard-repuestos')}>
                        <div className="icon">🔧</div>
                        <h3>Gestión de Hardware</h3>
                        <p>Ver y gestionar repuestos necesarios. Control de inventario y compras pendientes.</p>
                    </div>

                    <div className="menu-item proximamente" onClick={() => mostrarProximamente('Reportes')}>
                        <div className="icon">📊</div>
                        <h3>Reportes y Estadísticas</h3>
                        <p>Generar reportes de ventas, servicios y estadísticas del negocio. (Próximamente)</p>
                    </div>

                    <div className="menu-item proximamente" onClick={() => mostrarProximamente('Clientes')}>
                        <div className="icon">👥</div>
                        <h3>Gestión de Clientes</h3>
                        <p>Administrar base de datos de clientes y historial de servicios. (Próximamente)</p>
                    </div>
                </div>

                <div className="info-panels" style={{ marginTop: '3rem' }}>
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>Solicitudes Pendientes</h4>
                            <div className="stat-number">{stats.solicitudesPendientes}</div>
                            <p>Servicios en proceso</p>
                        </div>
                        <div className="info-card">
                            <h4>Repuestos Críticos</h4>
                            <div className="stat-number">{stats.repuestosCriticos}</div>
                            <p>Requieren atención</p>
                        </div>
                        <div className="info-card">
                            <h4>Órdenes Hoy</h4>
                            <div className="stat-number">{stats.ordenesHoy}</div>
                            <p>Nuevas solicitudes</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MenuVentas;