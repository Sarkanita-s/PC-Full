import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole = null }) {
  const usuarioLogueado = localStorage.getItem('usuario_logueado');

  if (!usuarioLogueado) {
    // No está logueado, redirigir a sesión
    return <Navigate to="/sesion" replace />;
  }

  if (requiredRole) {
    const usuario = JSON.parse(usuarioLogueado);
    if (usuario.role !== requiredRole) {
      // Está logueado pero no tiene el rol requerido
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
