module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.dom.cjs', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^three/examples/jsm/(.*)$': '<rootDir>/tests/__mocks__/three-examples.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
<<<<<<< HEAD
    'node_modules/(?!(three|three/examples/jsm)/)'
=======
    'node_modules/(?!.*three/examples/jsm)'
>>>>>>> master
  ],
};