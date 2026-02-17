module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.dom.cjs', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '^three/examples/jsm/(.*)$': '<rootDir>/tests/__mocks__/three-examples.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!.*(@asamuzakjp|three|cannon-es|@exodus|html-encoding-sniffer))'],
};
