/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!three/examples/jsm/)',
    ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

export default config;