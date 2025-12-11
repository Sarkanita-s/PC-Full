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
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useInactivityLogout } from './hooks/useInactivityLogout.js'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function AppContent() {
  // Logout automático después de 15 minutos de inactividad (900000 ms)
  useInactivityLogout(15 * 60 * 1000);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/sesion" element={<Sesion />} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
        <Route path="/hard-repuestos" element={<ProtectedRoute requiredRole="admin"><HardRepuestos /></ProtectedRoute>} />
        <Route path="/ingresar-orden" element={<ProtectedRoute requiredRole="ventas"><IngresarOrden /></ProtectedRoute>} />
        <Route path="/menu-ventas" element={<ProtectedRoute requiredRole="ventas"><MenuVentas /></ProtectedRoute>} />
        <Route path="/estado-equipo" element={<EstadoEquipo />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;