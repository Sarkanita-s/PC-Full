import '@testing-library/jest-dom';

// Mock del localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock;

// Mock para las alerts
global.alert = vi.fn();

// Limpiar mocks antes de cada test
beforeEach(() => {
  vi.clearAllMocks();
});