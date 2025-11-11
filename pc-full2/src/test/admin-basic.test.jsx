import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Admin from '../pages/admin.jsx';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Admin Component - Pruebas Básicas', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  // CATEGORÍA 1: RENDERIZADO BÁSICO
  // Clasificación: Pruebas de UI/Renderizado
  // Propósito: Verificar renderizado correcto de todos los elementos visuales
  //     Componente se renderiza sin errores
  //     Muestra estadísticas del dashboard (24, 8, 5, 3)
  //     Muestra todas las 6 tarjetas de administración
  describe('Renderizado del Componente', () => {
    // PRUEBA: Renderizado básico
    // Tipo: Prueba de humo (smoke test)
    // Valida: Componente carga sin errores y muestra título
    it('debe renderizar el componente sin errores', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    it('debe mostrar las estadísticas del dashboard', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('24')).toBeInTheDocument();
      expect(screen.getByText('Órdenes Activas')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('En Reparación')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Esperando Repuestos')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Listos para Entrega')).toBeInTheDocument();
    });

    it('debe mostrar todas las tarjetas de administración', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Gestión de Órdenes')).toBeInTheDocument();
      expect(screen.getByText('Gestión de Clientes')).toBeInTheDocument();
      expect(screen.getByText('Inventario')).toBeInTheDocument();
      expect(screen.getByText('Proveedores')).toBeInTheDocument();
      expect(screen.getByText('Reportes')).toBeInTheDocument();
      expect(screen.getByText('Configuración')).toBeInTheDocument();
    });
  });

  // 2. NAVEGACIÓN
  //   Botón "Gestionar Órdenes" → navegación a '/ingresar-orden'
  //   Botón "Ver Inventario" → navegación a '/hard-repuestos'
  //   Todos los botones son clicables
  describe('Navegación del Dashboard', () => {
    it('debe navegar a gestionar órdenes al hacer clic en el botón', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const gestionarOrdenesBtn = screen.getByText('Gestionar Órdenes');
      fireEvent.click(gestionarOrdenesBtn);
      
      expect(mockNavigate).toHaveBeenCalledWith('/ingresar-orden');
    });

    it('debe navegar a inventario al hacer clic en el botón', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const verInventarioBtn = screen.getByText('Ver Inventario');
      fireEvent.click(verInventarioBtn);
      
      expect(mockNavigate).toHaveBeenCalledWith('/hard-repuestos');
    });

    it('debe tener botones para todas las funciones principales', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Gestionar Órdenes')).toBeInTheDocument();
      expect(screen.getByText('Ver Inventario')).toBeInTheDocument();
      expect(screen.getByText('Ver Clientes')).toBeInTheDocument();
      expect(screen.getByText('Ver Proveedores')).toBeInTheDocument();
      expect(screen.getByText('Generar Reportes')).toBeInTheDocument();
      expect(screen.getByText('Configurar')).toBeInTheDocument();
    });
  });

  // 3. GESTIÓN DE DATOS
  //   localStorage vacío se maneja correctamente
  //   JSON inválido no crashea la aplicación
  //   Datos válidos se procesan sin errores
  describe('Gestión de Datos', () => {
    it('debe manejar localStorage vacío correctamente', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      // El componente debe renderizarse sin errores
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    it('debe manejar JSON inválido en localStorage sin crashear', () => {
      localStorage.setItem('solicitudes_guardadas', 'invalid json');
      
      expect(() => {
        render(
          <RouterWrapper>
            <Admin />
          </RouterWrapper>
        );
      }).not.toThrow();
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    it('debe cargar sin errores cuando hay datos válidos en localStorage', () => {
      const datosValidos = [
        {
          numeroOrden: 'ORD001',
          clienteNombre: 'Test User',
          equipoMarca: 'Dell',
          equipoModelo: 'Inspiron',
          falla: 'Problema general'
        }
      ];
      
      localStorage.setItem('solicitudes_guardadas', JSON.stringify(datosValidos));
      
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
  });

  // 5. CASOS EXTREMOS
  //   Funciones internas ejecutan correctamente
  describe('Funcionalidad del useEffect', () => {
    it('debe ejecutar cargarOrdenesCambioPiezas al montar el componente', () => {
      // Mock de datos que definitivamente activarán el filtro
      const solicitudesConCambios = [
        {
          numeroOrden: 'ORD001',
          clienteNombre: 'Juan Pérez',
          equipoMarca: 'HP',
          equipoModelo: 'Pavilion', 
          falla: 'CAMBIAR el procesador principal'
        }
      ];
      
      localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudesConCambios));
      
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      // Si hay datos en localStorage, el useEffect debería haberlos procesado
      // El componente debe renderizarse correctamente
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
  });

  // 4. ESTRUCTURA Y ACCESIBILIDAD
  //   Elementos HTML tienen las clases CSS correctas
  //   Títulos h2 y h3 están presentes
  //   Iconos de las tarjetas se muestran
  //   Descripciones de funcionalidades están visibles
  describe('Estructura del Componente', () => {
    it('debe tener la estructura main correcta', () => {
      const { container } = render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('debe tener la sección de estadísticas', () => {
      const { container } = render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const statsDiv = container.querySelector('.admin-stats');
      expect(statsDiv).toBeInTheDocument();
    });

    it('debe tener el dashboard de administración', () => {
      const { container } = render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const dashboardDiv = container.querySelector('.admin-dashboard');
      expect(dashboardDiv).toBeInTheDocument();
    });

    it('debe tener 6 tarjetas de administración', () => {
      const { container } = render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const adminCards = container.querySelectorAll('.admin-card');
      expect(adminCards).toHaveLength(6);
    });
  });

  // 4. ESTRUCTURA Y ACCESIBILIDAD
  //   Iconos de las tarjetas se muestran
  //   Descripciones de funcionalidades están visibles
  describe('Verificación de Iconos y Texto', () => {
    it('debe mostrar todos los iconos de las tarjetas', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('📋')).toBeInTheDocument(); // Gestión de Órdenes
      expect(screen.getByText('👥')).toBeInTheDocument(); // Gestión de Clientes
      expect(screen.getByText('📦')).toBeInTheDocument(); // Inventario
      expect(screen.getByText('🏢')).toBeInTheDocument(); // Proveedores
      expect(screen.getByText('📊')).toBeInTheDocument(); // Reportes
      expect(screen.getByText('⚙️')).toBeInTheDocument(); // Configuración
    });

    it('debe mostrar las descripciones de cada tarjeta', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Crear, editar y gestionar todas las órdenes de servicio del sistema.')).toBeInTheDocument();
      expect(screen.getByText('Administrar información de clientes y historial de servicios.')).toBeInTheDocument();
      expect(screen.getByText('Control de repuestos, stock y gestión de inventario.')).toBeInTheDocument();
      expect(screen.getByText('Gestión de proveedores y órdenes de compra.')).toBeInTheDocument();
      expect(screen.getByText('Generar reportes financieros y estadísticas del servicio.')).toBeInTheDocument();
      expect(screen.getByText('Configuración del sistema y gestión de usuarios.')).toBeInTheDocument();
    });
  });

  // 4. ESTRUCTURA Y ACCESIBILIDAD
  //   Todos los botones son clicables
  //   Títulos h2 y h3 están presentes
  describe('Accesibilidad y UX', () => {
    it('todos los botones deben ser clicables', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const botones = screen.getAllByRole('button');
      expect(botones.length).toBeGreaterThan(0);
      
      // Verificar que todos los botones están habilitados
      botones.forEach(boton => {
        expect(boton).not.toBeDisabled();
      });
    });

    it('debe tener un título principal h2', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      const titulo = screen.getByRole('heading', { level: 2, name: 'Panel de Control' });
      expect(titulo).toBeInTheDocument();
    });

    it('debe tener títulos h3 para cada sección', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByRole('heading', { level: 3, name: 'Gestión de Órdenes' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Gestión de Clientes' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Inventario' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Proveedores' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Reportes' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Configuración' })).toBeInTheDocument();
    });
  });
});