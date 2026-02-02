module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.dom.cjs', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^three/examples/jsm/(.*)': '<rootDir>/node_modules/three/examples/jsm/$1'
  },
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*three/examples/jsm)'
  ],
};