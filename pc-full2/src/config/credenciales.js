// NOTA IMPORTANTE: Este archivo contiene credenciales de prueba.
// En producción, estas credenciales DEBEN venir de un servidor backend seguro,
// nunca desde el código frontend.
//
// El backend debe:
// 1. Recibir las credenciales de forma segura (POST con HTTPS)
// 2. Validarlas contra una base de datos
// 3. Enviar un JWT o token seguro (httpOnly, secure)
// 4. El frontend solo debe almacenar el token, no las credenciales

export const usuarios = {
  'admin': { password: 'admin123', role: 'admin' },
  'ventas': { password: 'ventas123', role: 'ventas' },
  'vendedor1': { password: 'venta123', role: 'ventas' },
  'sofia': { password: 'sofia123', role: 'ventas' },
  'cliente': { password: 'cliente123', role: 'client' }
};

// TODO: Implementar autenticación con backend
// const API_URL = process.env.REACT_APP_API_URL;
//
// export const autenticarUsuario = async (username, password, role) => {
//   const response = await fetch(`${API_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({ username, password, role })
//   });
//   
//   if (response.ok) {
//     const data = await response.json();
//     return data;
//   }
//   return null;
// };
