module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jest.dom.cjs', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
<<<<<<< HEAD
    '^three/examples/jsm/(.*)': '<rootDir>/node_modules/three/examples/jsm/$1',
=======
<<<<<<< HEAD
    '^three/examples/jsm/controls/(.*)': '<rootDir>/node_modules/three/examples/jsm/controls/$1',
    '^three/examples/jsm/(.*)': '<rootDir>/tests/__mocks__/three-examples.js'
=======
    '^three/examples/jsm/(.*)$': '<rootDir>/tests/__mocks__/three-examples.js'
>>>>>>> master
>>>>>>> master
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
<<<<<<< HEAD
  transformIgnorePatterns: ['node_modules/(?!.*three/examples/jsm)'],
};
=======
  transformIgnorePatterns: [
<<<<<<< HEAD
    'node_modules/(?!.*three/examples/jsm/)'
=======
<<<<<<< HEAD
    'node_modules/(?!.*three/examples/jsm/)'
=======
<<<<<<< HEAD
    'node_modules/(?!(three|three/examples/jsm)/)'
=======
    'node_modules/(?!.*three/examples/jsm)'
>>>>>>> master
>>>>>>> master
>>>>>>> master
  ],
};
>>>>>>> master
