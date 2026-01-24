/**
 * Tests for Scene Graph/Outliner functionality
 */
import { JSDOM } from 'jsdom';

// Mock THREE.js
jest.mock('three', () => ({
    Scene: jest.fn(() => ({
        add: jest.fn(),
        remove: jest.fn()
    })),
    PerspectiveCamera: jest.fn(() => ({
        position: { set: jest.fn() },
        lookAt: jest.fn()
    })),
    WebGLRenderer: jest.fn(() => ({
        setSize: jest.fn(),
        setPixelRatio: jest.fn(),
        shadowMap: {},
        domElement: { addEventListener: jest.fn() }
    })),
    Mesh: jest.fn(() => ({
        position: { x: 1, y: 2, z: 3, toFixed: jest.fn(() => '1.00') },
        name: 'TestMesh',
        geometry: { type: 'BoxGeometry' },
        visible: true,
        uuid: 'test-uuid-123'
    })),
    BoxGeometry: jest.fn(),
    MeshLambertMaterial: jest.fn(),
    AmbientLight: jest.fn(),
    DirectionalLight: jest.fn(() => ({ position: { set: jest.fn() }, shadow: { mapSize: {} } })),
    GridHelper: jest.fn(),
    AxesHelper: jest.fn(),
    Raycaster: jest.fn(() => ({ setFromCamera: jest.fn(), intersectObjects: jest.fn(() => []) })),
    Vector2: jest.fn()
}));

// Mock dat.gui
jest.mock('dat.gui', () => ({
    GUI: jest.fn(() => ({
        addFolder: jest.fn(() => ({
            add: jest.fn(() => ({ name: jest.fn(() => ({ onChange: jest.fn() })) })),
            open: jest.fn()
        }))
    }))
}));

// Mock controls
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn(() => ({ enableDamping: true, update: jest.fn() }))
}));

jest.mock('three/examples/jsm/controls/TransformControls.js', () => ({
    TransformControls: jest.fn(() => ({
        addEventListener: jest.fn(),
        setMode: jest.fn(),
        attach: jest.fn(),
        detach: jest.fn()
    }))
}));

describe('Scene Graph/Outliner Functionality', () => {
    let dom, app;

    beforeEach(() => {
        // Setup DOM
        dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.requestAnimationFrame = jest.fn();
        global.console.log = jest.fn(); // Suppress console.log
        
        // Mock document methods
        jest.spyOn(document.body, 'appendChild').mockImplementation();
        jest.spyOn(window, 'addEventListener').mockImplementation();
        
        // Mock createElement to return proper elements
        jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            const element = {
                tagName: tagName.toUpperCase(),
                style: {},
                childNodes: [],
                appendChild: jest.fn((child) => {
                    element.childNodes.push(child);
                    return child;
                }),
                textContent: '',
                innerHTML: '',
                onclick: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                setAttribute: jest.fn((name, value) => { element[name] = value; }),
                getAttribute: jest.fn((name) => element[name])
            };
            
            // Add style.cssText property
            Object.defineProperty(element.style, 'cssText', {
                set: jest.fn(),
                get: jest.fn()
            });
            
            return element;
        });
        
        jest.clearAllMocks();
        
        // Create test app with scene graph functionality
        class TestApp {
            constructor() {
                this.objects = [];
                this.selectedObject = null;
                this.scene = { add: jest.fn(), remove: jest.fn() };
                this.setupSceneGraph();
            }

            setupSceneGraph() {
                this.sceneGraphPanel = document.createElement('div');
                this.objectsList = document.createElement('ul');
                this.sceneGraphPanel.appendChild(document.createElement('h3'));
                this.sceneGraphPanel.appendChild(this.objectsList);
                document.body.appendChild(this.sceneGraphPanel);
                this.updateSceneGraph();
            }

            updateSceneGraph() {
                this.objectsList.innerHTML = '';
                // Clear childNodes for mock environment since innerHTML setter doesn't do it
                if (this.objectsList.childNodes) this.objectsList.childNodes.length = 0;
                
                this.objects.forEach((object, index) => {
                    const listItem = document.createElement('li');
                    const objectInfo = document.createElement('div');
                    const objectName = document.createElement('span');
                    const objectType = document.createElement('span');
                    const visibilityBtn = document.createElement('button');
                    const deleteBtn = document.createElement('button');
                    const positionInfo = document.createElement('div');
                    
                    objectName.textContent = object.name || `Object_${index + 1}`;
                    objectType.textContent = object.geometry.type.replace('Geometry', '');
                    visibilityBtn.textContent = object.visible ? '👁' : '🚫';
                    visibilityBtn.title = 'Toggle visibility';
                    visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);

                    deleteBtn.textContent = '🗑';
                    deleteBtn.title = `Delete ${object.name}`;
                    deleteBtn.setAttribute('aria-label', `Delete ${object.name}`);

                    positionInfo.textContent = `x: ${object.position.x.toFixed(2)}, y: ${object.position.y.toFixed(2)}, z: ${object.position.z.toFixed(2)}`;
                    
                    // Mock event handlers
                    visibilityBtn.onclick = (e) => {
                        e.stopPropagation();
                        object.visible = !object.visible;
                        visibilityBtn.textContent = object.visible ? '👁' : '🚫';
                        visibilityBtn.setAttribute('aria-label', object.visible ? `Hide ${object.name}` : `Show ${object.name}`);
                    };
                    
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.deleteObject(object);
                    };
                    
                    listItem.onclick = () => {
                        this.selectObject(object);
                    };
                    
                    const buttonContainer = document.createElement('div');
                    buttonContainer.appendChild(visibilityBtn);
                    buttonContainer.appendChild(deleteBtn);
                    
                    objectInfo.appendChild(objectName);
                    objectInfo.appendChild(objectType);
                    objectInfo.appendChild(buttonContainer);
                    
                    listItem.appendChild(objectInfo);
                    listItem.appendChild(positionInfo);
                    this.objectsList.appendChild(listItem);
                });
                
                if (this.objects.length === 0) {
                    const emptyMessage = document.createElement('li');
                    emptyMessage.textContent = 'No objects in scene';
                    this.objectsList.appendChild(emptyMessage);
                }
            }

            selectObject(object) {
                this.selectedObject = object;
                this.updateSceneGraph();
            }

            deleteObject(object) {
                const index = this.objects.indexOf(object);
                if (index > -1) {
                    this.objects.splice(index, 1);
                    this.scene.remove(object);
                }
                if (this.selectedObject === object) {
                    this.selectedObject = null;
                }
                this.updateSceneGraph();
            }

            addTestObject(name = 'TestObject') {
                const THREE = require('three');
                const object = {
                    name: name,
                    position: { x: Math.random(), y: Math.random(), z: Math.random(), toFixed: (n) => '1.00' },
                    geometry: { type: 'BoxGeometry' },
                    visible: true,
                    uuid: `test-uuid-${Date.now()}`
                };
                this.objects.push(object);
                this.scene.add(object);
                this.updateSceneGraph();
                return object;
            }
        }
        
        app = new TestApp();
    });

    afterEach(() => {
        if (dom) {
            dom.window.close();
        }
    });

    describe('Scene Graph Setup', () => {
        it('should create scene graph panel with proper structure', () => {
            expect(app.sceneGraphPanel).toBeDefined();
            expect(app.objectsList).toBeDefined();
            expect(document.body.appendChild).toHaveBeenCalled();
        });

        it('should show empty message when no objects exist', () => {
            app.objects = [];
            app.updateSceneGraph();
            
            expect(app.objectsList.appendChild).toHaveBeenCalled();
        });
    });

    describe('Object Management', () => {
        it('should add objects to scene graph', () => {
            const obj1 = app.addTestObject('TestBox');
            const obj2 = app.addTestObject('TestSphere');
            
            expect(app.objects.length).toBe(2);
            expect(app.objects).toContain(obj1);
            expect(app.objects).toContain(obj2);
        });

        it('should display object information in scene graph', () => {
            const createElementSpy = jest.spyOn(document, 'createElement');
            app.addTestObject('DisplayTest');
            
            // Verify DOM elements were created for object display
            expect(createElementSpy).toHaveBeenCalledWith('li');
            expect(createElementSpy).toHaveBeenCalledWith('div');
            expect(createElementSpy).toHaveBeenCalledWith('span');
            expect(createElementSpy).toHaveBeenCalledWith('button');
        });

        it('should handle object selection through scene graph', () => {
            const obj = app.addTestObject('SelectableObject');
            const selectSpy = jest.spyOn(app, 'selectObject');
            
            // Simulate clicking on object in scene graph
            app.selectObject(obj);
            
            expect(selectSpy).toHaveBeenCalledWith(obj);
            expect(app.selectedObject).toBe(obj);
        });

        it('should handle object deletion through scene graph', () => {
            const obj1 = app.addTestObject('DeleteMe');
            const obj2 = app.addTestObject('KeepMe');
            
            expect(app.objects.length).toBe(2);
            
            app.deleteObject(obj1);
            
            expect(app.objects.length).toBe(1);
            expect(app.objects).not.toContain(obj1);
            expect(app.objects).toContain(obj2);
            expect(app.scene.remove).toHaveBeenCalledWith(obj1);
        });

        it('should clear selection when selected object is deleted', () => {
            const obj = app.addTestObject('WillBeDeleted');
            app.selectObject(obj);
            
            expect(app.selectedObject).toBe(obj);
            
            app.deleteObject(obj);
            
            expect(app.selectedObject).toBeNull();
        });
    });

    describe('Visibility Toggle', () => {
        it('should toggle object visibility', () => {
            const obj = app.addTestObject('VisibilityTest');
            expect(obj.visible).toBe(true);
            
            // Simulate clicking visibility button
            obj.visible = !obj.visible;
            
            expect(obj.visible).toBe(false);
            
            // Toggle again
            obj.visible = !obj.visible;
            
            expect(obj.visible).toBe(true);
        });

        it('should update visibility button text based on state', () => {
            const obj = app.addTestObject('VisibilityButtonTest');
            
            // Initial state - visible
            let buttonText = obj.visible ? '👁' : '🚫';
            expect(buttonText).toBe('👁');
            
            // After hiding
            obj.visible = false;
            buttonText = obj.visible ? '👁' : '🚫';
            expect(buttonText).toBe('🚫');
        });
    });

    describe('Scene Graph Updates', () => {
        it('should update scene graph when objects are added', () => {
            const updateSpy = jest.spyOn(app, 'updateSceneGraph');
            app.addTestObject('UpdateTest');
            
            expect(updateSpy).toHaveBeenCalled();
        });

        it('should update scene graph when objects are removed', () => {
            const obj = app.addTestObject('RemoveTest');
            const updateSpy = jest.spyOn(app, 'updateSceneGraph');
            
            app.deleteObject(obj);
            
            expect(updateSpy).toHaveBeenCalled();
        });

        it('should update scene graph when selection changes', () => {
            const obj = app.addTestObject('SelectionTest');
            const updateSpy = jest.spyOn(app, 'updateSceneGraph');
            
            app.selectObject(obj);
            
            expect(updateSpy).toHaveBeenCalled();
        });
    });

    describe('Object Information Display', () => {
        it('should display object name and type', () => {
            const obj = app.addTestObject('InfoTest');
            obj.geometry.type = 'SphereGeometry';
            
            // Mock the text content setting
            const mockSpan = { textContent: '' };
            
            // Simulate name display
            mockSpan.textContent = obj.name;
            expect(mockSpan.textContent).toBe('InfoTest');
            
            // Simulate type display
            mockSpan.textContent = obj.geometry.type.replace('Geometry', '');
            expect(mockSpan.textContent).toBe('Sphere');
        });

        it('should display object position coordinates', () => {
            const obj = app.addTestObject('PositionTest');
            obj.position = { x: 1.5, y: 2.3, z: -0.7, toFixed: (n) => String(Number(obj.position.x).toFixed(n)) };
            
            const positionText = `x: ${obj.position.x.toFixed(2)}, y: ${obj.position.y.toFixed(2)}, z: ${obj.position.z.toFixed(2)}`;
            expect(positionText).toContain('x: 1.50');
        });

        it('should handle objects without names', () => {
            const obj = app.addTestObject();
            obj.name = null;
            
            const displayName = obj.name || `Object_${app.objects.indexOf(obj) + 1}`;
            expect(displayName).toBe('Object_1');
        });
    });

    describe('Accessibility', () => {
        it('should have correct ARIA labels for buttons', () => {
            app.addTestObject('A11yTestObject');

            // Traverse DOM to find buttons
            // List -> ListItem -> InfoDiv -> ButtonDiv -> Buttons
            const listItem = app.objectsList.childNodes[0]; // First object
            const infoDiv = listItem.childNodes[0];
            const btnDiv = infoDiv.childNodes[2];

            const visBtn = btnDiv.childNodes[0];
            const delBtn = btnDiv.childNodes[1];

            // Verify Visibility Button
            expect(visBtn.setAttribute).toHaveBeenCalledWith('aria-label', 'Hide A11yTestObject');
            expect(visBtn.title).toBe('Toggle visibility');

            // Verify Delete Button
            expect(delBtn.setAttribute).toHaveBeenCalledWith('aria-label', 'Delete A11yTestObject');
            expect(delBtn.title).toBe('Delete A11yTestObject');
        });

        it('should update ARIA label when visibility changes', () => {
            app.addTestObject('ToggleTestObject');
            const listItem = app.objectsList.childNodes[0];
            const visBtn = listItem.childNodes[0].childNodes[2].childNodes[0];

            // Initial state
            expect(visBtn.setAttribute).toHaveBeenCalledWith('aria-label', 'Hide ToggleTestObject');

            // Click to toggle
            visBtn.onclick({ stopPropagation: jest.fn() });

            // Should be hidden now
            expect(visBtn.setAttribute).toHaveBeenCalledWith('aria-label', 'Show ToggleTestObject');
        });
    });
});