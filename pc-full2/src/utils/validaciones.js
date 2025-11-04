// Utilidades de validación

/**
 * Valida formato de RUT chileno (con guión)
 * @param {string} rut - RUT a validar (formato: 12345678-9)
 * @returns {boolean} true si el formato es válido
 */
export function validarRUT(rut) {
  const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
  return rutRegex.test(rut);
}

/**
 * Formatea RUT mientras se escribe
 * @param {string} valor - Valor a formatear
 * @returns {string} RUT formateado en mayúsculas
 */
export function formatearRUT(valor) {
  // Eliminar caracteres no numéricos excepto 'k' o 'K'
  let limpio = valor.replace(/[^0-9kK]/g, '');
  
  // Si tiene más de 1 caracter, agregar guión antes del último
  if (limpio.length > 1) {
    limpio = limpio.slice(0, -1) + '-' + limpio.slice(-1);
  }
  
  return limpio.toUpperCase();
}

/**
 * Formatea número de teléfono con prefijo +56
 * @param {string} valor - Valor a formatear
 * @returns {string} Teléfono formateado
 */
export function formatearTelefono(valor) {
  // Eliminar caracteres no válidos (mantener solo números y +)
  let tel = valor.replace(/[^0-9+]/g, '');
  
  // Si hay contenido y no empieza con +, agregar +56
  if (tel.length > 0 && !tel.startsWith('+')) {
    tel = '+56 ' + tel;
  }
  
  return tel;
}

/**
 * Valida que un email tenga formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} true si el formato es válido
 */
export function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un número de teléfono chileno sea válido
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export function validarTelefono(telefono) {
  // Formato: +56912345678 (9 dígitos después del código país)
  const telefonoRegex = /^\+56[0-9]{9}$/;
  return telefonoRegex.test(telefono);
}
