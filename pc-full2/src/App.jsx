import './App.css'
import Header from './pages/header.jsx'
import Footer from './pages/footer.jsx'
import Principal from './pages/principal.jsx'
import Admin from './pages/admin.jsx'
import HardRepuestos from './pages/hard-repuestos.jsx'
import IngresarOrden from './pages/ingresar-orden.jsx'
import Sesion from './pages/sesion.jsx'
import MenuVentas from './pages/menu-ventas.jsx'
import EstadoEquipo from './pages/estado-equipo.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/sesion" element={<Sesion />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/hard-repuestos" element={<HardRepuestos />} />
        <Route path="/ingresar-orden" element={<IngresarOrden />} />
        <Route path="/menu-ventas" element={<MenuVentas />} />
        <Route path="/estado-equipo" element={<EstadoEquipo />} />
      </Routes>

      <Footer />
    </Router>
  )
}
export default App;