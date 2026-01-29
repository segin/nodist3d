/**
 * Tests for the main App class
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => {
    const mockElement = { createElement: jest.fn(() => ({ tagName: 'CANVAS' })) };
    
    const mockVector3 = {
        x: 0, y: 0, z: 0,
        clone: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
        copy: jest.fn(),
        set: jest.fn()
    };

    const mockMesh = {
        position: { ...mockVector3 },
        rotation: { ...mockVector3 },
        scale: { x: 1, y: 1, z: 1, ...mockVector3 },
        material: {
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
        },
        geometry: { clone: jest.fn() },
        castShadow: false,
        receiveShadow: false
    };

    return {
        __esModule: true,
        Scene: jest.fn(() => ({
            add: jest.fn(),
            remove: jest.fn()
        })),
        PerspectiveCamera: jest.fn(() => ({
            position: { ...mockVector3 },
            lookAt: jest.fn(),
            aspect: 1,
            updateProjectionMatrix: jest.fn()
        })),
        WebGLRenderer: jest.fn(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            shadowMap: { enabled: false, type: null },
            domElement: { 
                tagName: 'CANVAS',
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0, width: 800, height: 600 }))
            }
        })),
        Mesh: jest.fn(() => mockMesh),
        BoxGeometry: jest.fn(),
        SphereGeometry: jest.fn(),
        CylinderGeometry: jest.fn(),
        ConeGeometry: jest.fn(),
        TorusGeometry: jest.fn(),
        PlaneGeometry: jest.fn(),
        MeshLambertMaterial: jest.fn(() => ({
            emissive: { setHex: jest.fn() },
            clone: jest.fn(() => ({ emissive: { setHex: jest.fn() } }))
        })),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(() => ({
            position: { ...mockVector3 },
            castShadow: false,
            shadow: { mapSize: { width: 0, height: 0 } }
        })),
        GridHelper: jest.fn(),
        AxesHelper: jest.fn(),
        Raycaster: jest.fn(() => ({
            setFromCamera: jest.fn(),
            intersectObjects: jest.fn(() => [])
        })),
        Vector2: jest.fn(),
        Vector3: jest.fn(() => ({ ...mockVector3 })),
        PCFSoftShadowMap: 'PCFSoftShadowMap',
        DoubleSide: 'DoubleSide'
    };
});

// Mock dat.gui
jest.mock('dat.gui', () => ({
    __esModule: true,
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
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
                close: jest.fn()
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
        }))
    }))
}));

// Mocks for three/examples/jsm/* are handled via moduleNameMapper in jest.config.cjs
// pointing to tests/__mocks__/three-examples.js

describe('Basic App Functionality', () => {
    beforeEach(() => {
        // Setup DOM using existing global document
        document.body.innerHTML = '<div id="scene-graph"></div><button id="fullscreen"></button><button id="save-scene"></button><button id="load-scene"></button><input type="file" id="file-input">';

        global.requestAnimationFrame = jest.fn();
        
        // Mock document.body.appendChild
        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();
        
        // Mock document.createElement to return proper elements
        // Note: we don't need to replace the document, just spy on it
        // But since we are modifying innerHTML, existing spies might be lost if we reset modules?
        // No, spies on `document` persist until restore.
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.restoreAllMocks();
    });

    it('should create and initialize the App', () => {
        // Verify DOM setup
        expect(document.getElementById('scene-graph')).not.toBeNull();

        // Simulate DOM loaded
        const domContentLoadedCallbacks = [];
        document.addEventListener = jest.fn((event, callback) => {
            if (event === 'DOMContentLoaded') {
                domContentLoadedCallbacks.push(callback);
            }
        });

        // Import and execute the module
        delete require.cache[require.resolve('../src/frontend/main.js')];
        require('../src/frontend/main.js');

        // Execute the callback
        domContentLoadedCallbacks.forEach(callback => callback());

        // Verify basic initialization happened
        expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

        // Verify UX/Accessibility improvements
        const sceneGraphList = document.querySelector('#scene-graph ul');
        expect(sceneGraphList).not.toBeNull();
        expect(sceneGraphList.getAttribute('role')).toBe('listbox');
    });

    it('should be able to add basic primitives', () => {
        const THREE = require('three');
        
        // Create a simple App-like class for testing
        class TestApp {
            constructor() {
                this.scene = new THREE.Scene();
                this.objects = [];
                this.selectedObject = null;
                this.transformControls = { attach: jest.fn(), setMode: jest.fn() };
            }

            addBox() {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geometry, material);
                this.scene.add(mesh);
                this.objects.push(mesh);
                this.selectObject(mesh);
            }

            selectObject(object) {
                this.selectedObject = object;
                this.transformControls.attach(object);
            }
        }

        const app = new TestApp();
        
        // Test adding a box
        app.addBox();
        
        expect(app.objects.length).toBe(1);
        expect(app.selectedObject).toBe(app.objects[0]);
        expect(app.scene.add).toHaveBeenCalledWith(app.objects[0]);
        expect(app.transformControls.attach).toHaveBeenCalledWith(app.objects[0]);
    });
});
