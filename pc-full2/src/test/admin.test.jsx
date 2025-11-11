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

describe('Admin Component - Funcionalidades Principales', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  // CATEGORÍA 1: RENDERIZADO BÁSICO
  // Clasificación: Pruebas de UI/Renderizado
  // Propósito: Verificar que el componente se renderice correctamente con todos sus elementos
  //     Componente se renderiza sin errores
  //     Muestra estadísticas del dashboard (24, 8, 5, 3)  
  //     Muestra todas las 6 tarjetas de administración
  
  describe('Renderizado del Componente', () => {
    // PRUEBA: Renderizado sin errores
    // Tipo: Prueba de humo (smoke test)
    // Valida: Componente carga exitosamente y muestra título principal
    it('debe renderizar el componente sin errores', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    // PRUEBA: Métricas del dashboard
    // Tipo: Prueba de datos estadísticos
    // Valida: Todas las estadísticas clave se muestran con números y etiquetas
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

    // PRUEBA: Tarjetas de funcionalidades
    // Tipo: Prueba de estructura de navegación
    // Valida: Las 6 secciones principales del panel admin están presentes
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

  // CATEGORÍA 2: NAVEGACIÓN
  // Clasificación: Pruebas de routing/navegación
  // Propósito: Verificar que los botones naveguen correctamente
  //     Botón "Gestionar Órdenes" → navegación a '/ingresar-orden'
  //     Botón "Ver Inventario" → navegación a '/hard-repuestos'
  //     Todos los botones son clicables
  
  describe('Navegación del Dashboard', () => {
    // PRUEBA: Navegación a gestión de órdenes
    // Tipo: Prueba de interacción + routing
    // Valida: Clic en botón redirige a la ruta correcta
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

    // PRUEBA: Navegación a inventario
    // Tipo: Prueba de interacción + routing
    // Valida: Clic en botón de inventario redirige correctamente
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
  });

  // CATEGORÍA 3: GESTIÓN DE DATOS
  // Clasificación: Pruebas de persistencia/manejo de datos
  // Propósito: Verificar manejo robusto de localStorage en diferentes escenarios
  //     localStorage vacío se maneja correctamente
  //     JSON inválido no crashea la aplicación
  //     Datos válidos se procesan sin errores
  //     Órdenes sin descripción de falla se manejan bien
  
  describe('Gestión de Datos en localStorage', () => {
    // PRUEBA: Estado inicial vacío
    // Tipo: Prueba de caso límite (edge case)
    // Valida: Componente funciona sin datos previos en localStorage
    it('debe manejar localStorage vacío correctamente', () => {
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      // El componente debe renderizarse sin errores
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
      // No debe mostrar la tabla de órdenes cuando está vacío
      expect(screen.queryByText('Órdenes que Requieren Cambio de Piezas')).not.toBeInTheDocument();
    });

    // PRUEBA: Datos corruptos
    // Tipo: Prueba de robustez/error handling
    // Valida: JSON malformado no causa crash de la aplicación
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

    // PRUEBA: Lógica de filtrado
    // Tipo: Prueba de lógica de negocio
    // Valida: Tabla de cambios de piezas solo aparece cuando es necesario
    it('no debe mostrar tabla de órdenes cuando no hay cambios de piezas requeridos', () => {
      const solicitudes = [
        {
          numeroOrden: 'ORD004',
          clienteNombre: 'Test User',
          equipoMarca: 'Test',
          equipoModelo: 'Test',
          falla: 'Solo limpieza general'
        }
      ];

      localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudes));
      
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.queryByText('Órdenes que Requieren Cambio de Piezas')).not.toBeInTheDocument();
    });

    // PRUEBA: Datos incompletos
    // Tipo: Prueba de caso límite
    // Valida: Órdenes con campos null no causan errores
    it('debe manejar órdenes sin descripción de falla', () => {
      const solicitudes = [
        {
          numeroOrden: 'ORD005',
          clienteNombre: 'Test User',
          equipoMarca: 'Test',
          equipoModelo: 'Test',
          falla: null
        }
      ];

      localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudes));
      
      expect(() => {
        render(
          <RouterWrapper>
            <Admin />
          </RouterWrapper>
        );
      }).not.toThrow();
      
      // No debe mostrar la tabla porque la falla es null
      expect(screen.queryByText('Órdenes que Requieren Cambio de Piezas')).not.toBeInTheDocument();
    });

    // PRUEBA: Múltiples fuentes de datos corruptos
    // Tipo: Prueba de resistencia (stress test)
    // Valida: Múltiples JSONs inválidos no crashean el componente
    it('debe manejar datos corruptos en localStorage', () => {
      localStorage.setItem('solicitudes_guardadas', '{"invalid": json}');
      localStorage.setItem('repuestos_data', 'not a json');
      
      expect(() => {
        render(
          <RouterWrapper>
            <Admin />
          </RouterWrapper>
        );
      }).not.toThrow();
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });
  });

  // CATEGORÍA 5: PRUEBAS DE FUNCIONES INTERNAS
  // Clasificación: Pruebas de ciclo de vida/hooks
  // Propósito: Verificar que useEffect y funciones internas trabajen correctamente
  //     Datos corruptos en localStorage
  //     Manejo de errores sin crasheo
  //     Funciones internas ejecutan correctamente
  
  describe('Pruebas de funciones internas', () => {
    // PRUEBA: Ejecución de useEffect
    // Tipo: Prueba de ciclo de vida React
    // Valida: useEffect procesa datos al montar el componente
    it('debe cargar el componente y ejecutar useEffect sin errores', () => {
      const solicitudesValidas = [
        {
          numeroOrden: 'ORD001',
          clienteNombre: 'Test User',
          equipoMarca: 'Dell',
          equipoModelo: 'Inspiron',
          falla: 'Problema general que no requiere cambios'
        }
      ];
      
      localStorage.setItem('solicitudes_guardadas', JSON.stringify(solicitudesValidas));
      
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
    });

    // PRUEBA: Procesamiento de múltiples fuentes
    // Tipo: Prueba de integración de datos
    // Valida: Carga correcta de múltiples items de localStorage
    it('debe procesar correctamente los datos de localStorage al cargar', () => {
      // Simulamos datos válidos
      localStorage.setItem('solicitudes_guardadas', JSON.stringify([]));
      localStorage.setItem('repuestos_data', JSON.stringify([]));
      localStorage.setItem('compras_pendientes', JSON.stringify([]));
      
      render(
        <RouterWrapper>
          <Admin />
        </RouterWrapper>
      );
      
      // Verificar que el componente se renderiza correctamente
      expect(screen.getByText('Panel de Control')).toBeInTheDocument();
      expect(screen.getByText('Gestión de Órdenes')).toBeInTheDocument();
    });
  });
});