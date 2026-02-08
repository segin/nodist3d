const THREE = jest.requireActual('three');

module.exports = {
  ...THREE,
  WebGLRenderer: jest.fn().mockReturnValue({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    shadowMap: { enabled: false, type: null },
    render: jest.fn(),
    domElement: document.createElement('div'),
  }),
  TextGeometry: jest.fn().mockImplementation(() => {
    return {
      type: 'TextGeometry',
      dispose: jest.fn(),
    };
  }),
  ObjectLoader: jest.fn().mockImplementation(() => ({
    parse: jest.fn((data) => {
        // Simple mock parser that returns a Scene with children based on input data
        // This avoids complex logic in real ObjectLoader that fails in test environment
        const scene = new THREE.Scene();
        if (data.children) {
            data.children.forEach(c => {
                const obj = new THREE.Object3D();
                obj.name = c.name;
                obj.uuid = c.uuid;
                obj.type = c.type;
                if (c.type === 'PointLight') {
                    obj.isPointLight = true;
                    obj.color = new THREE.Color(c.color);
                    obj.intensity = c.intensity;
                }
                if (c.type === 'DirectionalLight') {
                    obj.isDirectionalLight = true;
                    obj.color = new THREE.Color(c.color);
                    obj.intensity = c.intensity;
                }
                if (c.type === 'AmbientLight') {
                    obj.isAmbientLight = true;
                }
                if (c.type === 'Mesh') {
                    obj.isMesh = true;
                    obj.material = new THREE.MeshStandardMaterial(c.material);
                }

                if (c.position) obj.position.set(c.position[0], c.position[1], c.position[2]);

                scene.add(obj);
            });
        }
        return scene;
    })
  })),
};
