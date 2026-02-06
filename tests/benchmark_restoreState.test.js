
<<<<<<< HEAD
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
=======
import { JSDOM } from 'jsdom';
import { App } from '../src/frontend/main.js';

// Mock PrimitiveFactory to avoid three/examples issues with loaders
jest.mock('../src/frontend/PrimitiveFactory.js', () => {
    return {
        PrimitiveFactory: jest.fn().mockImplementation(() => ({
            createPrimitive: jest.fn(),
        }))
    };
});

// Mock THREE.js
jest.mock('three', () => {
    let uuidCounter = 0;
    const mockMesh = () => ({
        uuid: `uuid-${uuidCounter++}`,
        position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })) },
        scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn(() => ({ x: 1, y: 1, z: 1 })) },
        material: {
            color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), copy: jest.fn(), set: jest.fn(), clone: jest.fn(() => ({ getHex: jest.fn() })) },
            emissive: { getHex: jest.fn(() => 0x000000), setHex: jest.fn(), copy: jest.fn(), set: jest.fn(), clone: jest.fn(() => ({ getHex: jest.fn(() => 0x000000), setHex: jest.fn(), copy: jest.fn() })) },
            clone: jest.fn(() => ({
                color: { getHex: jest.fn(), clone: jest.fn() },
                emissive: { setHex: jest.fn(), copy: jest.fn(), clone: jest.fn() }
            })),
            dispose: jest.fn()
        },
        geometry: {
            type: 'BoxGeometry',
            dispose: jest.fn(),
            clone: jest.fn(() => ({
                type: 'BoxGeometry',
                dispose: jest.fn(),
                parameters: { width: 1, height: 1, depth: 1 }
            })),
            parameters: { width: 1, height: 1, depth: 1 }
        },
        userData: {},
        visible: true,
        castShadow: false,
        receiveShadow: false
    });
>>>>>>> master

    return {
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            traverse: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
<<<<<<< HEAD
            position: { ...mockVector3, set: jest.fn() },
            lookAt: jest.fn(),
            updateProjectionMatrix: jest.fn()
=======
            position: { set: jest.fn(), clone: jest.fn() },
            lookAt: jest.fn(),
            aspect: 1,
            updateProjectionMatrix: jest.fn(),
            clone: jest.fn()
>>>>>>> master
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
<<<<<<< HEAD
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
=======
            render: jest.fn(),
            shadowMap: { enabled: false, type: null },
            domElement: {
                tagName: 'CANVAS',
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 800, height: 600 })),
                clientWidth: 800,
                clientHeight: 600
            }
        })),
        Mesh: jest.fn(() => mockMesh()),
        BoxGeometry: jest.fn(() => ({ type: 'BoxGeometry', parameters: { width: 1, height: 1, depth: 1 } })),
        SphereGeometry: jest.fn(() => ({ type: 'SphereGeometry', parameters: { radius: 1 } })),
        CylinderGeometry: jest.fn(() => ({ type: 'CylinderGeometry', parameters: { radiusTop: 1 } })),
        ConeGeometry: jest.fn(() => ({ type: 'ConeGeometry', parameters: { radius: 1 } })),
        TorusGeometry: jest.fn(() => ({ type: 'TorusGeometry', parameters: { radius: 1 } })),
        PlaneGeometry: jest.fn(() => ({ type: 'PlaneGeometry', parameters: { width: 1 } })),
        TetrahedronGeometry: jest.fn(() => ({ type: 'TetrahedronGeometry', parameters: {} })),
        IcosahedronGeometry: jest.fn(() => ({ type: 'IcosahedronGeometry', parameters: {} })),
        DodecahedronGeometry: jest.fn(() => ({ type: 'DodecahedronGeometry', parameters: {} })),
        OctahedronGeometry: jest.fn(() => ({ type: 'OctahedronGeometry', parameters: {} })),
        TubeGeometry: jest.fn(() => ({ type: 'TubeGeometry', parameters: {} })),
        TorusKnotGeometry: jest.fn(() => ({ type: 'TorusKnotGeometry', parameters: {} })),
        CatmullRomCurve3: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            color: { getHex: jest.fn(() => 0xffffff), setHex: jest.fn(), clone: jest.fn() },
            emissive: { setHex: jest.fn(), copy: jest.fn(), clone: jest.fn() },
            dispose: jest.fn(),
            clone: jest.fn()
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { set: jest.fn() },
            castShadow: false,
            shadow: { mapSize: { width: 0, height: 0 } }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Group: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            children: [],
            visible: true,
            position: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
            rotation: { x: 0, y: 0, z: 0, copy: jest.fn(), clone: jest.fn() },
            scale: { x: 1, y: 1, z: 1, copy: jest.fn(), clone: jest.fn() },
            uuid: `group-uuid-${uuidCounter++}`
        })),
>>>>>>> master
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
<<<<<<< HEAD
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
=======
        Vector2: jest.fn(),
        Vector3: jest.fn(),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide',
        TOUCH: { ROTATE: 0, DOLLY_PAN: 1 }
>>>>>>> master
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
<<<<<<< HEAD
            add: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })), onChange: jest.fn() })),
            addColor: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) })),
=======
            add: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn()
            })),
            addFolder: jest.fn(() => ({
                add: jest.fn(() => ({
                    name: jest.fn(() => ({ onChange: jest.fn() })),
                    onChange: jest.fn()
                })),
                addColor: jest.fn(() => ({
                    name: jest.fn(() => ({ onChange: jest.fn() })),
                    onChange: jest.fn()
                })),
                open: jest.fn(),
                close: jest.fn(),
                remove: jest.fn(),
                removeFolder: jest.fn(),
                __controllers: [],
                __folders: []
            })),
            addColor: jest.fn(() => ({
                name: jest.fn(() => ({ onChange: jest.fn() })),
                onChange: jest.fn()
            })),
>>>>>>> master
            open: jest.fn(),
            close: jest.fn(),
            remove: jest.fn(),
            removeFolder: jest.fn(),
            __controllers: [],
            __folders: []
        }))
    }))
}));

<<<<<<< HEAD
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
=======
// Mock OrbitControls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    __esModule: true,
    OrbitControls: jest.fn(() => ({
        enableDamping: true,
        dampingFactor: 0.05,
        enabled: true,
        update: jest.fn(),
        touches: {},
        target: { clone: jest.fn(), copy: jest.fn() }
    }))
}));

// Mock TransformControls
jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    __esModule: true,
>>>>>>> master
    TransformControls: jest.fn(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
<<<<<<< HEAD
        detach: jest.fn()
=======
        detach: jest.fn(),
        dragging: false
>>>>>>> master
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
<<<<<<< HEAD
        global.navigator = dom.window.navigator;
        global.requestAnimationFrame = jest.fn();
        global.console.log = jest.fn(); // Suppress console.log

        // Mock document methods
        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();
=======
        global.requestAnimationFrame = jest.fn();
        global.navigator = { userAgent: 'node', maxTouchPoints: 0 };
        delete global.window.ontouchstart;

        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();

>>>>>>> master
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            const element = {
                tagName: tagName.toUpperCase(),
                style: {},
                appendChild: jest.fn(),
                textContent: '',
                innerHTML: '',
<<<<<<< HEAD
                set cssText(value) {}
            };
            // Define style properties to avoid errors
            element.style.cssText = '';
            return element;
        });

        // Instantiate App
=======
                onclick: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                id: ''
            };
            Object.defineProperty(element.style, 'cssText', { set: jest.fn(), get: jest.fn() });
            return element;
        });

        jest.clearAllMocks();

        // Create app instance
>>>>>>> master
        app = new App();
    });

    afterEach(() => {
<<<<<<< HEAD
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
=======
        if (dom) dom.window.close();
    });

    test('Benchmark: restoreState with 200 objects', () => {
        // 1. Populate scene
        const saveStateSpy = jest.spyOn(app, 'saveState').mockImplementation(() => {});
        const updateSceneGraphSpy = jest.spyOn(app, 'updateSceneGraph').mockImplementation(() => {});
        const objectCount = 200;
        for (let i = 0; i < objectCount; i++) {
            app.addBox();
        }
        saveStateSpy.mockRestore();
        updateSceneGraphSpy.mockRestore();

        // 2. Save State (Baseline)
        app.saveState('Baseline');

        // 3. Modify Scene
        if (app.objects.length > 0) {
            app.objects[0].position.x += 1;
        }

        // 4. Save State again (Action)
        app.saveState('Action');

        // 5. Benchmark Undo
        const updateSceneGraphSpy2 = jest.spyOn(app, 'updateSceneGraph').mockImplementation(() => {});
        const start = performance.now();

        app.undo();

        const end = performance.now();
        updateSceneGraphSpy2.mockRestore();
        const duration = end - start;

        console.log(`[Benchmark] restoreState with ${objectCount} objects took: ${duration.toFixed(3)}ms`);

        expect(app.objects.length).toBe(objectCount);
>>>>>>> master
    });
});
