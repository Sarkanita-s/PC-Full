import "../css/estilos.css";
import { Link } from 'react-router-dom';

function Principal() {
  return (
    <main>
      <div>
      <section id="Inicio">
        <div className="hero-content">
          <h1>Servicio Técnico Profesional de Computadoras</h1>
          <p>
            Reparación, mantenimiento y optimización de equipos con garantía y
            calidad
          </p>
          <div className="hero-buttons">
            <Link to="/estado-equipo" className="btn btn-primary">
              Ver estado
            </Link>
            <a href="#servicios" className="btn btn-outline">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      <section id="servicios">
        <h2>Nuestros Servicios</h2>
        <div className="services-grid">
          <p>💻Instalación de sistema operativo: elegir cual.</p>
          <p>🖥️Actualizaciones de sistema operativo.</p>
          <p>⚙️Problemas de hardware: describir.</p>
          <p>📦Instalación de software.</p>
          <p>🦠Eliminación de virus.</p>
          <p>🔧Mantencion General.</p>
          <p>🔥Sobrecalentamiento.</p>
          <p>💽Formateo.</p>
          <p>📂Respaldos.</p>
        </div>
      </section>

      <section id="contacto">
        <h2>Contacto</h2>
        <div className="contacto-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.980995403512!2d-70.65732042430697!3d-33.50187157336922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dac50b48e4d1%3A0xaea2e1bc15f83a81!2sGran%20Av.%20Jos%C3%A9%20Miguel%20Carrera%205287%2C%208920187%20San%20Miguel%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1758583995591!5m2!1ses-419!2scl"
            width="600"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación PC Full"
          ></iframe>

          <img src="../img/pcfull-local.png" alt="Logo PC Full" width="300" />
        </div>
        <div className="contacto-info">
          <p>AL NORTE DE METRO DEPARTAMENTAL</p>
          <p>📍GRAN AVENIDA J.M. CARRERA 5287, SAN MIGUEL</p>
          <p>☎️Fono: 225221603 </p>
          <p>📱 WhatsApp: +56 9 5412 8451</p>
          <p>✉️ Email: pcfullsanmiguel@gmail.com</p>
        </div>
      </section>

      <section id="clientes">
        <h2>Área Clientes</h2>
      </section>
      </div>
    </main>
  );
}

export default Principal;
