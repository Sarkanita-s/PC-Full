import '../css/estilos.css';

function HeaderAdmin() {
  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <span>PC Full - Panel de Ventas</span>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#" onclick="mostrarAyuda()">
                Ayuda
              </a>
            </li>
            <li>
              <a href="client.html">Ver Sitio Público</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderAdmin;