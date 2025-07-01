class MockEventDispatcher {
    constructor() {
        this._listeners = {};
    }
    addEventListener(type, listener) {
        if (!this._listeners[type]) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    }
    removeEventListener(type, listener) {
        if (this._listeners[type]) {
            this._listeners[type] = this._listeners[type].filter(l => l !== listener);
        }
    }
    dispatchEvent(event) {
        if (this._listeners[event.type]) {
            this._listeners[event.type].forEach(listener => listener(event));
        }
    }
}

class MockObject3D extends MockEventDispatcher {
    constructor() {
        super();
        this.uuid = 'mock-uuid-' + Math.random();
        this.name = 'mock-object';
        this.children = [];
        this.parent = null;
        this.isObject3D = true;
        this.type = 'Object3D';
    }
    add(object) {
        this.children.push(object);
        object.parent = this;
        this.dispatchEvent({ type: 'added', target: object });
    }
    remove(object) {
        this.children = this.children.filter(child => child !== object);
        object.parent = null;
        this.dispatchEvent({ type: 'removed', target: object });
    }
    clone() {
        const cloned = new MockObject3D();
        Object.assign(cloned, this);
        cloned.uuid = 'mock-uuid-clone-' + Math.random();
        cloned.children = this.children.map(child => child.clone());
        return cloned;
    }
    traverse(callback) { callback(this); this.children.forEach(child => child.traverse(callback)); }
    updateMatrixWorld() {}
    removeFromParent() { if (this.parent) this.parent.remove(this); }
    dispose() {}
}

class MockMesh extends MockObject3D {
    constructor(geometry, material) {
        super();
        this.geometry = geometry;
        this.material = {
            ...material,
            color: { getHex: () => 0x123456, set: jest.fn() },
            needsUpdate: false,
            map: null,
            normalMap: null,
            roughnessMap: null,
            dispose: jest.fn()
        };
        this.isMesh = true;
        this.type = 'Mesh';
        this.uuid = 'mock-mesh-uuid-' + Math.random();
        this.name = 'mock-mesh';
    }
    clone() {
        const cloned = new MockMesh(this.geometry, this.material);
        Object.assign(cloned, this);
        cloned.uuid = 'mock-mesh-uuid-clone-' + Math.random();
        return cloned;
    }
}

class MockScene extends MockObject3D {
    constructor() {
        super();
        this.type = 'Scene';
    }
}

class MockTextureLoader {
    load(url, onLoad) {
        const texture = { url };
        onLoad(texture);
    }
}

class MockColor {
    constructor(color) {
        this.value = color;
    }
    set(color) {
        this.value = color;
    }
    getHex() {
        return this.value;
    }
}

class MockVector2 { constructor(x, y) { this.x = x; this.y = y; } }
class MockVector3 { constructor(x, y, z) { this.x = x; this.y = y; this.z = z; } }
class MockEuler { constructor(x, y, z, order) { this._x = x; this._y = y; this._z = z; this._order = order; } }
class MockQuaternion { constructor(x, y, z, w) { this._x = x; this._y = y; this._z = z; this._w = w; } }
class MockMatrix4 { constructor() { this.elements = []; } }
class MockLayers { constructor() { this.mask = 1; } }
class MockMeshPhongMaterial { constructor() { this.isMaterial = true; this.color = new MockColor(0x44aa88); } }
class MockBufferAttribute { constructor() {} }
class MockUint16BufferAttribute { constructor() {} }
class MockFloat32BufferAttribute { constructor() {} }
class MockSphere { constructor() {} }
class MockCatmullRomCurve3 { constructor() { return { points: [] }; } }
class MockShape { constructor() {} }
class MockLOD extends MockObject3D { constructor() { super(); this.type = 'LOD'; this.levels = []; } addLevel(object, distance) { this.levels.push({ object, distance }); } }

// Geometries
class MockBoxGeometry { constructor() { this.type = 'BoxGeometry'; } }
class MockSphereGeometry { constructor() { this.type = 'SphereGeometry'; } }
class MockCylinderGeometry { constructor() { this.type = 'CylinderGeometry'; } }
class MockConeGeometry { constructor() { this.type = 'ConeGeometry'; } }
class MockTorusGeometry { constructor() { this.type = 'TorusGeometry'; } }
class MockTorusKnotGeometry { constructor() { this.type = 'TorusKnotGeometry'; } }
class MockIcosahedronGeometry { constructor() { this.type = 'IcosahedronGeometry'; } }
class MockDodecahedronGeometry { constructor() { this.type = 'DodecahedronGeometry'; } }
class MockOctahedronGeometry { constructor() { this.type = 'OctahedronGeometry'; } }
class MockPlaneGeometry { constructor() { this.type = 'PlaneGeometry'; } }
class MockTubeGeometry { constructor() { this.type = 'TubeGeometry'; } }
class MockTeapotGeometry { constructor() { this.type = 'BufferGeometry'; } } // TeapotGeometry is a BufferGeometry
class MockExtrudeGeometry { constructor() { this.type = 'ExtrudeGeometry'; } }
class MockLatheGeometry { constructor() { this.type = 'LatheGeometry'; } }
class MockTextGeometry { constructor() { this.type = 'TextGeometry'; this.center = jest.fn(); this.dispose = jest.fn(); this.morphTargets = []; } }


module.exports = {
    Scene: MockScene,
    TextureLoader: MockTextureLoader,
    Object3D: MockObject3D,
    Mesh: MockMesh,
    Color: MockColor,
    Vector2: MockVector2,
    Vector3: MockVector3,
    Euler: MockEuler,
    Quaternion: MockQuaternion,
    Matrix4: MockMatrix4,
    Layers: MockLayers,
    MeshPhongMaterial: MockMeshPhongMaterial,
    BufferAttribute: MockBufferAttribute,
    Uint16BufferAttribute: MockUint16BufferAttribute,
    Float32BufferAttribute: MockFloat32BufferAttribute,
    Sphere: MockSphere,
    CatmullRomCurve3: MockCatmullRomCurve3,
    Shape: MockShape,
    LOD: MockLOD,
    BoxGeometry: MockBoxGeometry,
    SphereGeometry: MockSphereGeometry,
    CylinderGeometry: MockCylinderGeometry,
    ConeGeometry: MockConeGeometry,
    TorusGeometry: MockTorusGeometry,
    TorusKnotGeometry: MockTorusKnotGeometry,
    IcosahedronGeometry: MockIcosahedronGeometry,
    DodecahedronGeometry: MockDodecahedronGeometry,
    OctahedronGeometry: MockOctahedronGeometry,
    PlaneGeometry: MockPlaneGeometry,
    TubeGeometry: MockTubeGeometry,
    TeapotGeometry: MockTeapotGeometry,
    ExtrudeGeometry: MockExtrudeGeometry,
    LatheGeometry: MockLatheGeometry,
    TextGeometry: MockTextGeometry,
    FrontSide: 0, // Mock THREE.FrontSide
    DoubleSide: 2, // Mock THREE.DoubleSide
};
