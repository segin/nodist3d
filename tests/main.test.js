/**
 * Tests for the main App class
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
  const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };

});

// Mock dat.gui
jest.mock('dat.gui', () => ({
  GUI: jest.fn(() => ({
    addFolder: jest.fn(() => ({
      add: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      addFolder: jest.fn(() => ({
        add: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        addColor: jest.fn(() => ({
          name: jest.fn(() => ({ onChange: jest.fn() })),
          onChange: jest.fn(),
        })),
        open: jest.fn(),
        close: jest.fn(),
      })),
      addColor: jest.fn(() => ({
        name: jest.fn(() => ({ onChange: jest.fn() })),
        onChange: jest.fn(),
      })),
      open: jest.fn(),
      close: jest.fn(),
      remove: jest.fn(),
      removeFolder: jest.fn(),
      __controllers: [],
      __folders: [],
    })),
  })),
});
