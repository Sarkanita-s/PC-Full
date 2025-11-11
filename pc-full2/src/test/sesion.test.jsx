import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sesion from '../pages/sesion';

const useNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => useNavigate,
  };
});

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Sesion Component - Sistema de Login', () => {
  beforeEach(() => {
    useNavigate.mockClear();
  });

  // Categoria: Renderizado y elementos visuales
  // Clasificación: Pruebas de UI/Renderizado
  // Propósito: Verificar que todos los elementos visuales se muestren correctamente

  describe('Renderizado Básico y Elementos Principales', () => {
    // PRUEBA: Renderizado completo del formulario
    // Tipo: Prueba de integración UI
    // Valida: Presencia de todos los elementos del formulario de login
    it('debe renderizar todos los elementos del formulario de login', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('PC Full - Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Usuario:')).toBeInTheDocument();
      expect(screen.getByText('Contraseña:')).toBeInTheDocument();
      expect(screen.getByText('Tipo de acceso:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ingresar al Sistema' })).toBeInTheDocument();
    });

    // PRUEBA: Elementos de branding
    // Tipo: Prueba visual/cosmética
    // Valida: Iconos y títulos de la interfaz
    it('debe mostrar el ícono de computadora y título correcto', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('💻')).toBeInTheDocument();
      expect(screen.getByText('PC Full - Iniciar Sesión')).toBeInTheDocument();
    });

    // PRUEBA: Opciones de roles de usuario
    // Tipo: Prueba funcional
    // Valida: Existencia de los 3 tipos de acceso disponibles
    it('debe mostrar opciones de tipo de acceso', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Equipo de Ventas')).toBeInTheDocument();
      expect(screen.getByText('Cliente')).toBeInTheDocument();
    });

    // PRUEBA: Navegación de retorno
    // Tipo: Prueba de navegación/routing
    // Valida: Link correcto hacia la página principal pública
    it('debe tener enlace para volver al sitio público', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const linkPublico = screen.getByText('Volver al sitio público');
      expect(linkPublico).toBeInTheDocument();
      expect(linkPublico.closest('a')).toHaveAttribute('href', '/');
    });

    // PRUEBA: Recuperación de sesión
    // Tipo: Prueba de UX/ayuda al usuario
    // Valida: Presencia del link para limpiar sesión problemática
    it('debe mostrar enlace para limpiar sesión', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('¿Problemas de acceso?')).toBeInTheDocument();
      expect(screen.getByText('Limpiar sesión')).toBeInTheDocument();
    });
  });

  // CATEGORÍA: NAVEGACIÓN Y RUTAS
  // Clasificación: Pruebas de navegación/routing
  // Propósito: Verificar redirecciones y navegación entre páginas

  describe('Navegación y Rutas', () => {
    // PRUEBA: Login de administrador
    // Tipo: Prueba de integración (autenticación + routing)
    // Valida: Redirección correcta después de login exitoso de admin
    it('debe navegar a admin con credenciales de administrador', async () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const usernameInput = screen.getByRole('textbox');
      const passwordInputs = screen.getAllByDisplayValue('');
      const passwordInput = passwordInputs.find(input => input.type === 'password');
      const roleSelect = screen.getByRole('combobox');
      const submitButton = screen.getByRole('button', { name: 'Ingresar al Sistema' });

      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });
      fireEvent.change(roleSelect, { target: { value: 'admin' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(useNavigate).toHaveBeenCalledWith('/admin');
      }, { timeout: 3000 });
    });

    // PRUEBA: Link de navegación pública
    // Tipo: Prueba de routing estático
    // Valida: Atributo href correcto del enlace de retorno
    it('debe manejar navegación del enlace de regreso', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const enlaceRegreso = screen.getByText('Volver al sitio público');
      expect(enlaceRegreso.closest('a')).toHaveAttribute('href', '/');
    });
  });

  // CATEGORÍA: GESTIÓN DE SESIÓN Y LOCALSTORAGE
  // Clasificación: Pruebas de persistencia de datos
  // Propósito: Verificar manejo correcto de datos de sesión en localStorage

  describe('Gestión de Sesión y localStorage', () => {
    // PRUEBA: Limpieza de sesión
    // Tipo: Prueba de limpieza de datos
    // Valida: Eliminación correcta de datos de sesión del localStorage
    it('debe limpiar localStorage al hacer clic en limpiar sesión', () => {
      localStorage.setItem('usuario_logueado', 'test');
      localStorage.setItem('solicitud_borrador', 'test');

      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const limpiarButton = screen.getByText('Limpiar sesión');
      fireEvent.click(limpiarButton);

      expect(localStorage.getItem('usuario_logueado')).toBeUndefined();
      expect(localStorage.getItem('solicitud_borrador')).toBeUndefined();
    });

    // PRUEBA: Feedback de limpieza
    // Tipo: Prueba de UX/mensajes al usuario
    // Valida: Mensaje de confirmación después de limpiar sesión
    it('debe mostrar mensaje de confirmación al limpiar sesión', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const limpiarButton = screen.getByText('Limpiar sesión');
      fireEvent.click(limpiarButton);

      expect(screen.getByText('Sesión limpiada. Intenta iniciar sesión nuevamente.')).toBeInTheDocument();
    });
  });

  // CATEGORÍA: ESTRUCTURA Y ACCESIBILIDAD
  // Clasificación: Pruebas de accesibilidad/estándares web
  // Propósito: Verificar HTML semántico y accesibilidad del formulario
  
  describe('Estructura y Accesibilidad', () => {
    // PRUEBA: Estructura HTML de formulario
    // Tipo: Prueba de estructura semántica
    // Valida: Uso correcto de elemento <form>
    it('debe tener estructura de formulario correcta', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const form = screen.getByRole('button', { name: 'Ingresar al Sistema' }).closest('form');
      expect(form).toBeInTheDocument();
    });

    // PRUEBA: Botón de submit
    // Tipo: Prueba de accesibilidad/HTML semántico
    // Valida: Botón tiene type="submit" correcto
    it('debe mostrar botón de envío correcto', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole('button', { name: 'Ingresar al Sistema' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    // PRUEBA: Campos de formulario
    // Tipo: Prueba de completitud del formulario
    // Valida: Existencia de todos los tipos de input necesarios
    it('debe contener todos los campos de entrada', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const textInputs = screen.getAllByRole('textbox');
      const passwordInputs = screen.getAllByDisplayValue('');
      const selects = screen.getAllByRole('combobox');

      expect(textInputs.length).toBeGreaterThan(0);
      expect(passwordInputs.length).toBeGreaterThan(0);
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  // CATEGORÍA: CASOS EXTREMOS Y VALIDACIONES
  // Clasificación: Pruebas de robustez/edge cases
  // Propósito: Verificar comportamiento en escenarios límite y estado inicial
  
  describe('Casos Extremos y Validaciones', () => {
    // PRUEBA: Estado inicial del formulario
    // Tipo: Prueba de estado por defecto
    // Valida: Formulario se muestra completo en estado inicial
    it('debe mostrar formulario de login por defecto', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('PC Full - Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Usuario:')).toBeInTheDocument();
      expect(screen.getByText('Contraseña:')).toBeInTheDocument();
      expect(screen.getByText('Tipo de acceso:')).toBeInTheDocument();
    });

    // PRUEBA: Enlaces auxiliares
    // Tipo: Prueba de navegación secundaria
    // Valida: Presencia de links de ayuda y navegación
    it('debe tener enlaces de navegación funcionales', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const enlacePublico = screen.getByText('Volver al sitio público');
      const limpiarEnlace = screen.getByText('Limpiar sesión');

      expect(enlacePublico).toBeInTheDocument();
      expect(limpiarEnlace).toBeInTheDocument();
    });

    // PRUEBA: Opciones de selector de roles
    // Tipo: Prueba de elementos de formulario
    // Valida: Todas las opciones de rol están disponibles
    it('debe mostrar opciones en el selector de rol', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('Seleccionar tipo...')).toBeInTheDocument();
      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Equipo de Ventas')).toBeInTheDocument();
      expect(screen.getByText('Cliente')).toBeInTheDocument();
    });

    // PRUEBA: Estructura CSS
    // Tipo: Prueba de estilo/estructura DOM
    // Valida: Contenedor principal tiene la clase CSS correcta
    it('debe tener el contenedor de login con clase correcta', () => {
      const { container } = render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      const loginContainer = container.querySelector('.login-container');
      expect(loginContainer).toBeInTheDocument();
    });

    // PRUEBA: Branding del encabezado
    // Tipo: Prueba visual/identidad
    // Valida: Logo y título están presentes
    it('debe mostrar logo y título en el encabezado', () => {
      render(
        <RouterWrapper>
          <Sesion />
        </RouterWrapper>
      );

      expect(screen.getByText('💻')).toBeInTheDocument();
      expect(screen.getByText('PC Full - Iniciar Sesión')).toBeInTheDocument();
    });
  });
});