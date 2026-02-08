
import { App } from '../src/frontend/main.js';
import * as THREE from 'three';
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockVector3 = {
        x: 0, y: 0, z: 0,
        clone: jest.fn(function() { return { ...this, x: this.x, y: this.y, z: this.z }; }),
        copy: jest.fn(function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }),
        set: jest.fn(function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; })
    };

    const mockColor = {
        r: 0, g: 0, b: 0,
        clone: jest.fn(() => ({ ...mockColor })),
        copy: jest.fn(),
        setHex: jest.fn(),
        getHex: jest.fn(() => 0)
    };

    const mockMaterial = {
        color: mockColor,
        emissive: { ...mockColor },
        dispose: jest.fn(),
        clone: jest.fn(() => ({ ...mockMaterial, color: { ...mockColor }, emissive: { ...mockColor } }))
    };

    const mockGeometry = {
        type: 'BoxGeometry',
        dispose: jest.fn(),
        clone: jest.fn(() => ({ ...mockGeometry })),
        parameters: { width: 1, height: 1, depth: 1 }
    };

    const mockMesh = {
        position: { ...mockVector3 },
        rotation: { ...mockVector3 },
        scale: { ...mockVector3, x: 1, y: 1, z: 1 },
        material: mockMaterial,
        geometry: mockGeometry,
        name: 'TestMesh',
        visible: true,
        uuid: 'test-uuid',
        userData: {},
        castShadow: true,
        receiveShadow: true
    };

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            traverse: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { ...mockVector3, set: jest.fn() },
            lookAt: jest.fn(),
            updateProjectionMatrix: jest.fn()
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            shadowMap: {},
            domElement: {
                addEventListener: jest.fn(),
                appendChild: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 100, height: 100 }))
            },
            render: jest.fn()
        })),
        Mesh: jest.fn(() => {
            const mesh = { ...mockMesh };
            mesh.position = { ...mockVector3 };
            mesh.rotation = { ...mockVector3 };
            mesh.scale = { ...mockVector3, x: 1, y: 1, z: 1 };
            mesh.material = { ...mockMaterial, color: { ...mockColor }, emissive: { ...mockColor } };
            mesh.geometry = { ...mockGeometry };
            mesh.uuid = Math.random().toString();
            return mesh;
        }),
        BoxGeometry: jest.fn(() => ({ ...mockGeometry })),
        SphereGeometry: jest.fn(() => ({ ...mockGeometry, type: 'SphereGeometry' })),
        CylinderGeometry: jest.fn(() => ({ ...mockGeometry, type: 'CylinderGeometry' })),
        ConeGeometry: jest.fn(() => ({ ...mockGeometry, type: 'ConeGeometry' })),
        TorusGeometry: jest.fn(() => ({ ...mockGeometry, type: 'TorusGeometry' })),
        PlaneGeometry: jest.fn(() => ({ ...mockGeometry, type: 'PlaneGeometry' })),
        TorusKnotGeometry: jest.fn(() => ({ ...mockGeometry, type: 'TorusKnotGeometry' })),
        TetrahedronGeometry: jest.fn(() => ({ ...mockGeometry, type: 'TetrahedronGeometry' })),
        IcosahedronGeometry: jest.fn(() => ({ ...mockGeometry, type: 'IcosahedronGeometry' })),
        DodecahedronGeometry: jest.fn(() => ({ ...mockGeometry, type: 'DodecahedronGeometry' })),
        OctahedronGeometry: jest.fn(() => ({ ...mockGeometry, type: 'OctahedronGeometry' })),
        TubeGeometry: jest.fn(() => ({ ...mockGeometry, type: 'TubeGeometry' })),
        MeshLambertMaterial: jest.fn(() => ({ ...mockMaterial, color: { ...mockColor }, emissive: { ...mockColor } })),
        Vector3: jest.fn(() => ({ ...mockVector3 })),
        Vector2: jest.fn(() => ({ x: 0, y: 0 })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn() },
            shadow: { mapSize: {} }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
        CatmullRomCurve3: jest.fn(),
        Group: jest.fn(() => ({
             add: jest.fn(),
             children: []
        })),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        FrontSide: 'FrontSide',
        TOUCH: { ROTATE: 0, DOLLY_PAN: 1 },
        Clock: jest.fn(() => ({
            getDelta: jest.fn(() => 0.016)
        }))
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })), onChange: jest.fn() })),
            addColor: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) })),
            open: jest.fn(),
            close: jest.fn(),
            remove: jest.fn(),
            removeFolder: jest.fn(),
            __controllers: [],
            __folders: []
        }))
    }))
}));

// Mock controls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn(() => ({
        enableDamping: true,
        update: jest.fn(),
        target: { clone: jest.fn(() => ({ copy: jest.fn() })) }
    }))
}));

jest.mock('three/examples/jsm/geometries/TeapotGeometry.js', () => ({
    TeapotGeometry: jest.fn()
}));

jest.mock('three/examples/jsm/loaders/FontLoader.js', () => ({
    FontLoader: jest.fn(() => ({
        load: jest.fn()
    }))
}));

jest.mock('three/examples/jsm/geometries/TextGeometry.js', () => ({
    TextGeometry: jest.fn()
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn()
    }))
}));

describe('Performance Benchmark: restoreState', () => {
    let dom;
    let app;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.navigator = dom.window.navigator;
        global.requestAnimationFrame = jest.fn();
        global.console.log = jest.fn(); // Suppress console.log

        // Mock document methods
        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            const element = {
                tagName: tagName.toUpperCase(),
                style: {},
                appendChild: jest.fn(),
                textContent: '',
                innerHTML: '',
                set cssText(value) {}
            };
            // Define style properties to avoid errors
            element.style.cssText = '';
            return element;
        });

        // Instantiate App
        app = new App();
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
        jest.clearAllMocks();
    });

    test('Benchmark: restoreState with 100 objects', () => {
        // 1. Populate scene with 100 objects
        const objectCount = 100;
        for (let i = 0; i < objectCount; i++) {
            app.addBox();
        }

        // Verify object count
        expect(app.objects.length).toBe(objectCount);

        // 2. Save baseline state
        app.saveState('Baseline');

        // 3. Modify one object
        const obj = app.objects[0];
        obj.position.x += 10;
        app.saveState('Modified');

        // Reset counters for dispose
        const THREE = require('three');
        // We need to access the mock instances to check calls.
        // Since we can't easily access all created instances, we can check the class method mocks if possible,
        // OR we can assume that app.objects[i].geometry.dispose is the spy.

        // Let's rely on checking the first object's geometry dispose, or better,
        // we can check how many times the geometry constructor was called during restore.
        // But re-instantiation is what we want to avoid.

        const initialGeometryInstances = THREE.BoxGeometry.mock.instances.length;
        const initialMaterialInstances = THREE.MeshLambertMaterial.mock.instances.length;

        // 4. Measure restoreState (Undo)
        const startTime = performance.now();
        app.undo(); // This calls restoreState
        const endTime = performance.now();

        const duration = endTime - startTime;
        process.stdout.write(`restoreState time for ${objectCount} objects: ${duration.toFixed(3)}ms\n`);

        // 5. Verify metrics
        const finalGeometryInstances = THREE.BoxGeometry.mock.instances.length;
        const finalMaterialInstances = THREE.MeshLambertMaterial.mock.instances.length;

        const createdGeometries = finalGeometryInstances - initialGeometryInstances;
        const createdMaterials = finalMaterialInstances - initialMaterialInstances;

        process.stdout.write(`Created Geometries during restore: ${createdGeometries}\n`);
        process.stdout.write(`Created Materials during restore: ${createdMaterials}\n`);

        // Current implementation destroys and recreates everything.
        // So createdGeometries should be roughly objectCount.
        // With optimization, this should be 0 (or very low).

        // Assertions for Baseline (Current inefficient behavior)
        // These assertions will FAIL when optimization is implemented, which is good.
        // For now, let's just log them or make soft assertions.

        // We return the metrics to be used in the PR description
        // return {
        //     duration,
        //     createdGeometries,
        //     createdMaterials
        // };
    });
});
