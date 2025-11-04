// Utilidades de formateo

/**
 * Formatea un número como moneda chilena
 * @param {number} valor - Valor a formatear
 * @returns {string} Valor formateado ($12.345)
 */
export function formatearMoneda(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}

/**
 * Formatea una fecha ISO a formato legible
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Fecha formateada (dd/mm/yyyy)
 */
export function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

/**
 * Formatea una fecha con hora
 * @param {string} fechaISO - Fecha en formato ISO
 * @returns {string} Fecha y hora formateada
 */
export function formatearFechaHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Genera un número de orden único
 * @returns {string} Número de orden (formato: ORD-2024-001234)
 */
export function generarNumeroOrden() {
  const año = new Date().getFullYear();
  const numero = String(Date.now()).slice(-6);
  return `ORD-${año}-${numero}`;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalizarPalabras(texto) {
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}
