// aquí se valida el rut (sin puntos ni guion, con dígito verificador)
function validarRUN(run) {
  const regex = /^[0-9]{7,8}[0-9Kk]$/; // 7-9 dígitos + dígito verificador
  return regex.test(run);
}

// validar solo los correos que contengan @gmail.com
function validarCorreo(correo) {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(correo);
}


document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const run = document.getElementById('run').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!validarRUN(run)) {
    alert("El RUN ingresado no es válido. Debe ser sin puntos ni guion, ej: 19011022K");
    return;
  }

  if (!validarCorreo(correo)) {
    alert("El correo debe ser @gmail.com");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  alert("Registro exitoso ✅");
  window.location.href = "login.html"; // después de registrar, se regresa al login
});
