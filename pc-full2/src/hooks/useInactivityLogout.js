import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para manejar logout automático por inactividad
 * @param {number} tiempoInactividadMs - Tiempo en milisegundos antes de hacer logout (default: 15 minutos)
 */
export function useInactivityLogout(tiempoInactividadMs = 1 * 60 * 1000) {
  const navigate = useNavigate();
  const timeoutIdRef = useRef(null);
  const isLoggedInRef = useRef(false);

  useEffect(() => {
    // Verificar si está logueado
    isLoggedInRef.current = !!localStorage.getItem('usuario_logueado');

    if (!isLoggedInRef.current) {
      return; // No ejecutar si no está logueado
    }

    // Función para resetear el timer de inactividad
    const resetTimer = () => {
      // Limpiar el timer anterior
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      // Crear nuevo timer
      timeoutIdRef.current = setTimeout(() => {
        // Tiempo de inactividad alcanzado - hacer logout
        localStorage.removeItem('usuario_logueado');
        localStorage.removeItem('solicitud_borrador');
        localStorage.removeItem('solicitudes_guardadas');
        localStorage.removeItem('repuestos_data');
        localStorage.removeItem('compras_pendientes');

        // Redirigir a sesión
        navigate('/sesion');

        // Mostrar mensaje
        alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
      }, tiempoInactividadMs);
    };

    // Eventos que resetean el timer (usuario activo)
    const eventos = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Agregar listeners
    eventos.forEach(evento => {
      document.addEventListener(evento, resetTimer);
    });

    // Inicializar el timer
    resetTimer();

    // Cleanup: remover listeners y limpiar timeout
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      eventos.forEach(evento => {
        document.removeEventListener(evento, resetTimer);
      });
    };
  }, [navigate, tiempoInactividadMs]);
}
