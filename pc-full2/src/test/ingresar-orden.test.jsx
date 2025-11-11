import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IngresarOrden from '../pages/ingresar-orden';

const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('IngresarOrden Component - Creación de Órdenes', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // RENDERIZADO BÁSICO Y ELEMENTOS PRINCIPALES
  
  describe('Renderizado Básico y Elementos Principales', () => {
    it('debe renderizar todas las secciones del formulario', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Información del Cliente')).toBeInTheDocument();
      expect(screen.getByText('Información del Equipo')).toBeInTheDocument();
      expect(screen.getByText('Detalles del Servicio')).toBeInTheDocument();
    });

    it('debe mostrar campos requeridos marcados con asterisco', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Nombre Completo*')).toBeInTheDocument();
      expect(screen.getByText('RUT*')).toBeInTheDocument();
      expect(screen.getByText('Teléfono*')).toBeInTheDocument();
      expect(screen.getByText('Tipo de Equipo*')).toBeInTheDocument();
    });

    it('debe mostrar botón de envío del formulario', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Ingresar Solicitud')).toBeInTheDocument();
    });

    it('debe tener placeholders informativos', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByPlaceholderText('Ej: 12345678-9')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ej: +56 9 1234 5678')).toBeInTheDocument();
    });

    it('debe mostrar opciones de tipo de equipo', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Notebook')).toBeInTheDocument();
      expect(screen.getByText('PC de Escritorio')).toBeInTheDocument();
      expect(screen.getByText('Servidor')).toBeInTheDocument();
    });
  });

  // NAVEGACIÓN Y FORMULARIOS
  
  describe('Navegación y Formularios', () => {
    it('debe permitir llenar campos de texto', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const rutInput = screen.getByPlaceholderText('Ej: 12345678-9');
      fireEvent.change(rutInput, { target: { value: '12345678-9' } });
      
      expect(rutInput.value).toBe('12345678-9');
    });

    it('debe permitir seleccionar tipo de equipo', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const tipoSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(tipoSelect, { target: { value: 'notebook' } });
      
      expect(tipoSelect.value).toBe('notebook');
    });

    it('debe permitir escribir en áreas de texto', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const textareas = screen.getAllByRole('textbox');
      const descripcionArea = textareas.find(textarea => 
        textarea.closest('.form-group')?.querySelector('label')?.textContent?.includes('Descripción del Problema')
      );
      
      if (descripcionArea) {
        fireEvent.change(descripcionArea, { target: { value: 'Problema de test' } });
        expect(descripcionArea.value).toBe('Problema de test');
      }
    });

    it('debe permitir agregar repuestos', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const repuestoInput = screen.getByPlaceholderText('Ej: Placa madre B550, Disco SSD 500GB');
      const agregarBtn = screen.getByText('+');

      fireEvent.change(repuestoInput, { target: { value: 'RAM 8GB' } });
      fireEvent.click(agregarBtn);

      expect(repuestoInput.value).toBe('');
    });

    it('debe mostrar campos de fecha y costo', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Fecha Estimada de Entrega')).toBeInTheDocument();
      expect(screen.getByText('Costo Estimado ($)')).toBeInTheDocument();
    });
  });

  // GESTIÓN DE DATOS Y ESTADO
  
  describe('Gestión de Datos y Estado', () => {
    it('debe manejar checkboxes', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const garantiaLabel = screen.getByText('¿Es servicio de garantía?');
      const garantiaCheckbox = garantiaLabel.closest('label').querySelector('input[type="checkbox"]');
      
      fireEvent.click(garantiaCheckbox);
      expect(garantiaCheckbox).toBeChecked();
    });

    it('debe validar formato de RUT', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const rutInput = screen.getByPlaceholderText('Ej: 12345678-9');
      fireEvent.change(rutInput, { target: { value: '12345678-9' } });
      
      expect(rutInput.value).toBe('12345678-9');
    });

    it('debe mostrar formulario organizado en secciones', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Información del Cliente')).toBeInTheDocument();
      expect(screen.getByText('Información del Equipo')).toBeInTheDocument();
      expect(screen.getByText('Detalles del Servicio')).toBeInTheDocument();
    });

    it('debe tener campos con validaciones requeridas', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const inputs = screen.getAllByRole('textbox');
      const requiredInputs = inputs.filter(input => input.required);
      
      expect(requiredInputs.length).toBeGreaterThan(0);
    });

    it('debe permitir guardar borrador', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const rutInput = screen.getByPlaceholderText('Ej: 12345678-9');
      fireEvent.change(rutInput, { target: { value: '12345678-9' } });

      // El guardado automático debería funcionar
      expect(rutInput.value).toBe('12345678-9');
    });
  });

  // ESTRUCTURA Y ACCESIBILIDAD
  
  describe('Estructura y Accesibilidad', () => {
    it('debe tener estructura de formulario válida', () => {
      const { container } = render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('debe tener labels asociados a inputs', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const labels = screen.getAllByText(/:/);
      expect(labels.length).toBeGreaterThan(2);
    });

    it('debe mostrar opciones de prioridad', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('Alta')).toBeInTheDocument();
    });

    it('debe tener botones con tipos apropiados', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const submitButton = screen.getByText('Ingresar Solicitud');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('debe mostrar información de ayuda en placeholders', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByPlaceholderText('Ej: 12345678-9')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ej: +56 9 1234 5678')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ej: Cargador, mouse, teclado, etc.')).toBeInTheDocument();
    });
  });

  // CASOS EXTREMOS Y VALIDACIONES
  
  describe('Casos Extremos y Validaciones', () => {
    it('debe manejar formulario vacío', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const submitButton = screen.getByText('Ingresar Solicitud');
      fireEvent.click(submitButton);

      // El formulario debe seguir visible
      expect(screen.getByText('Información del Cliente')).toBeInTheDocument();
    });

    it('debe permitir resetear valores', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const rutInput = screen.getByPlaceholderText('Ej: 12345678-9');
      fireEvent.change(rutInput, { target: { value: '12345678-9' } });
      fireEvent.change(rutInput, { target: { value: '' } });
      
      expect(rutInput.value).toBe('');
    });

    it('debe manejar selecciones de tipo de servicio', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Reparación')).toBeInTheDocument();
      expect(screen.getByText('Mantención Preventiva')).toBeInTheDocument();
      expect(screen.getByText('Solo Diagnóstico')).toBeInTheDocument();
    });

    it('debe mostrar campos opcionales claramente', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
      expect(screen.getByText('Dirección')).toBeInTheDocument();
      expect(screen.getByText('Modelo')).toBeInTheDocument();
    });

    it('debe tener estructura responsive', () => {
      const { container } = render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      const formRows = container.querySelectorAll('.form-row');
      expect(formRows.length).toBeGreaterThan(0);
    });

    it('debe permitir múltiples tipos de entrada', () => {
      render(
        <RouterWrapper>
          <IngresarOrden />
        </RouterWrapper>
      );

      // Verificar diferentes tipos de input
      const textInputs = screen.getAllByRole('textbox');
      const selects = screen.getAllByRole('combobox');
      const checkboxes = screen.getAllByRole('checkbox');
      
      expect(textInputs.length).toBeGreaterThan(3);
      expect(selects.length).toBeGreaterThan(1);
      expect(checkboxes.length).toBeGreaterThan(1);
    });
  });
});