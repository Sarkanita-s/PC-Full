import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/estilos.css';

function Header() {
  const [adminLinkVisible, setAdminLinkVisible] = useState(false);

  useEffect(() => {
    const handleDoubleClick = (event) => {
      const clickX = event.clientX;
      const clickY = event.clientY;
      const secretZoneSize = 100;
      const isWithinSecretZone = clickX > (window.innerWidth - secretZoneSize) && clickY < secretZoneSize;

      if (isWithinSecretZone) {
        setAdminLinkVisible(true);
        setTimeout(() => {
          setAdminLinkVisible(false);
        }, 5000);
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);

    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <a href="#servicios">Servicios</a>
            </li>
            <li>
              <Link to="/ingresar-orden">Solicitar Servicio</Link>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
            <li>
              <a href="#clientes">Área Clientes</a>
            </li>
          </ul>
        </nav>

        <div className="action-blocks">
          <a href="https://wa.me/56954128451" target="_blank" rel="noopener noreferrer" className="blockwsp">
            WhatsApp
          </a>
          <Link to="/estado-equipo" className="blockest">
            Ver estado
          </Link>
          <Link
            to="/sesion"
            className={`blocklgn ${adminLinkVisible ? 'visible' : ''}`}
            id="adminLoginLink"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </header> 
  );
}

export default Header;
