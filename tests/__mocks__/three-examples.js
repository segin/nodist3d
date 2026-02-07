// tests/__mocks__/three-examples.js
const THREE = require('three');

module.exports = {
    TeapotGeometry: class extends THREE.BufferGeometry {},
    FontLoader: class {
        load(url, onLoad) { onLoad({ type: 'Font' }); }
    },
    TextGeometry: class extends THREE.BufferGeometry {},
    // Add other mocks if needed
};
