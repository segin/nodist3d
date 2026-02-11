module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.dom.cjs', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^three/examples/jsm/(.*)$': '<rootDir>/tests/__mocks__/three-examples.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(three|three/examples/jsm|cannon-es)/)'],
};
