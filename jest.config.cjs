module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    // We map controls to actual files if possible, or mocks if they are problematic.
    // The previous config had variations. Let's try to map to node_modules for real execution
    // but tests might rely on mocks.
    // However, if I want to run a benchmark using real Three.js, I need real Three.js.
    // The previous config mapped 'three/examples/jsm' to a mock file in some branches.
    // I'll keep it simple for now and rely on transformIgnorePatterns to let babel handle ESM.
    '^three/examples/jsm/(.*)$': '<rootDir>/node_modules/three/examples/jsm/$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*three)'
  ],
};
