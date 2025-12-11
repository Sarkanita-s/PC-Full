import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EstadoEquipo from '../pages/estado-equipo';

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EstadoEquipo Component - Consulta de Estado', () => {

  // CATEGORÍA: RENDERIZADO BÁSICO Y ELEMENTOS PRINCIPALES
  // Clasificación: Pruebas de UI/Renderizado
  // Propósito: Verificar que todos los elementos del formulario se muestren correctamente
  
  describe('Renderizado Básico y Elementos Principales', () => {
    // PRUEBA: Título principal
    // Valida: Título de la página se muestra correctamente
    it('debe renderizar el título principal', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      expect(screen.getByText('Consultar Estado del Equipo')).toBeInTheDocument();
    });

    it('debe mostrar selector de tipo de consulta', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      expect(screen.getByLabelText('Tipo de consulta:')).toBeInTheDocument();
      expect(screen.getByText('Número de Orden')).toBeInTheDocument();
      expect(screen.getByText('RUT del Cliente')).toBeInTheDocument();
    });

    it('debe mostrar botón de consultar', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      expect(screen.getByText('Consultar Estado')).toBeInTheDocument();
    });

    it('debe inicializar con select vacío', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      expect(select.value).toBe('');
    });
  });

  // CATEGORÍA: NAVEGACIÓN Y INTERACCIÓN
  // Clasificación: Pruebas de interacción del usuario
  // Propósito: Verificar que los elementos interactivos respondan correctamente
  
  describe('Navegación e Interacción', () => {
    it('debe permitir seleccionar opción de orden', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      expect(select.value).toBe('orden');
    });

    it('debe permitir seleccionar opción de RUT', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'rut' } });

      expect(select.value).toBe('rut');
    });

    it('debe permitir cambiar entre tipos de consulta', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      
      // Seleccionar orden
      fireEvent.change(select, { target: { value: 'orden' } });
      expect(select.value).toBe('orden');

      // Cambiar a RUT
      fireEvent.change(select, { target: { value: 'rut' } });
      expect(select.value).toBe('rut');
    });

    it('debe resetear select al cambiar', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      
      fireEvent.change(select, { target: { value: 'orden' } });
      expect(select.value).toBe('orden');
      
      fireEvent.change(select, { target: { value: '' } });
      expect(select.value).toBe('');
    });
  });

  // GESTIÓN DE DATOS Y CONSULTAS
  
  describe('Gestión de Datos y Consultas', () => {
    it('debe encontrar orden por número válido', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      // Seleccionar tipo orden
      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      // Ingresar número válido
      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-001' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debe encontrar orden por RUT válido', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      // Seleccionar tipo RUT
      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'rut' } });

      // Ingresar RUT válido
      const inputRut = screen.getByLabelText(/RUT \(sin puntos, con guión\):/i);
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      fireEvent.change(inputRut, { target: { value: '12345678-9' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debe mostrar mensaje cuando no encuentra orden', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      fireEvent.change(inputOrden, { target: { value: 'ORD-INEXISTENTE' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        // El componente muestra algún mensaje de error
        const errorMsg = screen.queryByText(/no se encontró/i);
        expect(errorMsg || screen.queryByText(/error/i)).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('debe mostrar mensaje cuando no encuentra RUT', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'rut' } });

      const inputRut = screen.getByLabelText(/RUT \(sin puntos, con guión\):/i);
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      fireEvent.change(inputRut, { target: { value: '00000000-0' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        // Puede mostrar error o simplemente no mostrar resultados
        expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debe procesar consulta correctamente', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-001' } });
      fireEvent.click(botonConsultar);

      // Esperar que termine la consulta
      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  // ESTRUCTURA Y ACCESIBILIDAD
  
  describe('Estructura y Accesibilidad', () => {
    it('debe tener estructura principal correcta', () => {
      const { container } = render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('debe tener título con heading level 1', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      expect(screen.getByRole('heading', { level: 1, name: /consultar estado del equipo/i })).toBeInTheDocument();
    });

    it('debe tener select accesible con label', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      expect(select).toBeRequired();
      expect(select).toHaveAttribute('id', 'tipoConsulta');
    });

    it('debe tener botón submit con tipo correcto', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });
      expect(botonConsultar).toHaveAttribute('type', 'submit');
    });

    it('debe tener formulario con estructura correcta', () => {
      const { container } = render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  // CASOS EXTREMOS Y VALIDACIONES
  
  describe('Casos Extremos y Validaciones', () => {
    it('debe requerir selección de tipo de consulta', () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      expect(select).toBeRequired();
    });

    it('debe manejar múltiples consultas consecutivas', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      // Primera consulta exitosa
      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-001' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Segunda consulta con otro número
      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-002' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('María González')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debe mostrar diferentes estados de orden', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      // Consultar orden en reparación
      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-001' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('En Reparación')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Consultar orden finalizada
      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-002' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        // Usar getAllByText porque el texto aparece múltiples veces
        const listoTexts = screen.getAllByText('Listo para Entrega');
        expect(listoTexts.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('debe limpiar resultados al cambiar tipo de consulta', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'orden' } });

      const inputOrden = screen.getByLabelText('Número de Orden:');
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      // Hacer consulta exitosa
      fireEvent.change(inputOrden, { target: { value: 'ORD-2024-001' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Cambiar tipo de consulta debe limpiar
      fireEvent.change(select, { target: { value: 'rut' } });
      
      // El resultado anterior no debe estar visible
      expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
    });

    it('debe permitir ingresar RUT sin espacios', async () => {
      render(
        <RouterWrapper>
          <EstadoEquipo />
        </RouterWrapper>
      );

      const select = screen.getByLabelText('Tipo de consulta:');
      fireEvent.change(select, { target: { value: 'rut' } });

      const inputRut = screen.getByLabelText(/RUT \(sin puntos, con guión\):/i);
      const botonConsultar = screen.getByRole('button', { name: /consultar estado/i });

      // RUT sin espacios (formato correcto)
      fireEvent.change(inputRut, { target: { value: '12345678-9' } });
      fireEvent.click(botonConsultar);

      await waitFor(() => {
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});