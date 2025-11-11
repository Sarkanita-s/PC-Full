import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Principal from '../pages/principal.jsx';

// Wrapper para React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Principal Component - Página de Inicio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. RENDERIZADO BÁSICO
  //   Componente se renderiza sin errores
  //   Muestra título principal y descripción
  //   Muestra todos los servicios disponibles
  describe('Renderizado del Componente', () => {
    it('debe renderizar el componente sin errores', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Servicio Técnico Profesional de Computadoras')).toBeInTheDocument();
    });

    it('debe mostrar el título principal y descripción', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      expect(screen.getByText('Servicio Técnico Profesional de Computadoras')).toBeInTheDocument();
      expect(screen.getByText('Reparación, mantenimiento y optimización de equipos con garantía y calidad')).toBeInTheDocument();
    });

    it('debe mostrar todos los servicios disponibles', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      expect(screen.getByText('💻Instalación de sistema operativo: elegir cual.')).toBeInTheDocument();
      expect(screen.getByText('🖥️Actualizaciones de sistema operativo.')).toBeInTheDocument();
      expect(screen.getByText('⚙️Problemas de hardware: describir.')).toBeInTheDocument();
      expect(screen.getByText('📦Instalación de software.')).toBeInTheDocument();
      expect(screen.getByText('🦠Eliminación de virus.')).toBeInTheDocument();
      expect(screen.getByText('🔧Mantencion General.')).toBeInTheDocument();
      expect(screen.getByText('🔥Sobrecalentamiento.')).toBeInTheDocument();
      expect(screen.getByText('💽Formateo.')).toBeInTheDocument();
      expect(screen.getByText('📂Respaldos.')).toBeInTheDocument();
    });
  });

  // 2. NAVEGACIÓN
  //   Enlace "Solicitar Servicio" → navegación a '/ingresar-orden'
  //   Enlace "Ver Servicios" → ancla a sección servicios
  //   Todos los enlaces son clicables
  describe('Enlaces y Navegación', () => {
    it('debe tener enlace para solicitar servicio', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const enlaceSolicitar = screen.getByText('Solicitar Servicio');
      expect(enlaceSolicitar).toBeInTheDocument();
      expect(enlaceSolicitar.closest('a')).toHaveAttribute('href', '/ingresar-orden');
    });

    it('debe tener enlace para ver servicios', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const enlaceServicios = screen.getByText('Ver Servicios');
      expect(enlaceServicios).toBeInTheDocument();
      expect(enlaceServicios).toHaveAttribute('href', '#servicios');
    });

    it('todos los enlaces deben ser clicables', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const enlaces = screen.getAllByRole('link');
      expect(enlaces.length).toBeGreaterThan(0);
      
      enlaces.forEach(enlace => {
        expect(enlace).not.toBeDisabled();
      });
    });
  });

  // 3. ESTRUCTURA DE CONTENIDO
  //   Sección de inicio está presente
  //   Sección de servicios está presente  
  //   Sección de contacto está presente
  describe('Estructura de Secciones', () => {
    it('debe tener sección de inicio', () => {
      const { container } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const seccionInicio = container.querySelector('#Inicio');
      expect(seccionInicio).toBeInTheDocument();
    });

    it('debe tener sección de servicios', () => {
      const { container } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const seccionServicios = container.querySelector('#servicios');
      expect(seccionServicios).toBeInTheDocument();
    });

    it('debe tener sección de contacto', () => {
      const { container } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const seccionContacto = container.querySelector('#contacto');
      expect(seccionContacto).toBeInTheDocument();
    });
  });

  // 4. ESTRUCTURA Y ACCESIBILIDAD
  //   Títulos h1 y h2 están presentes
  //   Elementos tienen clases CSS correctas
  //   Mapa de Google está integrado
  describe('Accesibilidad y Elementos', () => {
    it('debe tener títulos h1 y h2 correctos', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Servicio Técnico Profesional de Computadoras' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Nuestros Servicios' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Contacto' })).toBeInTheDocument();
    });

    it('debe tener las clases CSS necesarias', () => {
      const { container } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      expect(container.querySelector('.hero-content')).toBeInTheDocument();
      expect(container.querySelector('.hero-buttons')).toBeInTheDocument();
      expect(container.querySelector('.services-grid')).toBeInTheDocument();
      expect(container.querySelector('.btn.btn-primary')).toBeInTheDocument();
      expect(container.querySelector('.btn.btn-outline')).toBeInTheDocument();
    });

    it('debe tener iframe del mapa de Google', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );

      const iframe = screen.getByTitle('Ubicación PC Full');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src');
      expect(iframe.getAttribute('src')).toContain('google.com/maps');
    });
  });

  // 5. CASOS EXTREMOS
  //   Renderizado sin errores en diferentes estados
  //   Manejo correcto de elementos interactivos
  describe('Casos Extremos y Robustez', () => {
    it('debe renderizar correctamente múltiples veces', () => {
      const { unmount } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      unmount();
      
      expect(() => {
        render(
          <RouterWrapper>
            <Principal />
          </RouterWrapper>
        );
      }).not.toThrow();
    });

    it('debe manejar la carga del iframe sin errores', () => {
      render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const iframe = screen.getByTitle('Ubicación PC Full');
      expect(iframe).toHaveAttribute('loading', 'lazy');
      expect(iframe).toHaveAttribute('allowFullScreen');
    });

    it('debe tener estructura main correcta', () => {
      const { container } = render(
        <RouterWrapper>
          <Principal />
        </RouterWrapper>
      );
      
      const mainElement = container.querySelector('main');
      expect(mainElement).toBeInTheDocument();
    });
  });
});