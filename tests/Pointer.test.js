import { Scene, PerspectiveCamera, WebGLRenderer, Vector2, Raycaster, Mesh, BoxGeometry, MeshBasicMaterial, EdgesGeometry, LineBasicMaterial, LineSegments } from 'three';
import { Pointer } from '../src/frontend/Pointer.js';
import { EventBus } from '../src/frontend/EventBus.js';

describe('Pointer', () => {
    let camera;
    let scene;
    let renderer;
    let eventBus;
    let pointerInstance;
    let mockDomElement;

    beforeEach(() => {
        camera = new PerspectiveCamera(75, 1, 0.1, 1000);
        scene = new Scene();
        renderer = {
            domElement: document.createElement('canvas'),
            get size() { return { width: 100, height: 100 }; } // Mock size property
        };
        eventBus = new EventBus();
        pointerInstance = new Pointer(camera, scene, renderer, eventBus);

        mockDomElement = renderer.domElement;
        jest.spyOn(mockDomElement, 'addEventListener');
        jest.spyOn(mockDomElement, 'removeEventListener');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should dispatch a `selectionChange` event when an object is selected', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh);

        const eventSpy = jest.spyOn(eventBus, 'emit');

        // Simulate a click that intersects the mesh
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);

        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });

        expect(eventSpy).toHaveBeenCalledWith('selectionChange', mesh);
        expect(pointerInstance.selectedObject).toBe(mesh);
    });

    it('should dispatch `selectionChange` with a null payload on deselection', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh);

        // Select an object first
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });

        const eventSpy = jest.spyOn(eventBus, 'emit');

        // Simulate a click that does not intersect any object (deselection)
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([]);
        pointerInstance.onPointerDown({ clientX: 100, clientY: 100 });

        expect(eventSpy).toHaveBeenCalledWith('selectionChange', null);
        expect(pointerInstance.selectedObject).toBeNull();
    });

    it('should correctly apply an outline to a selected object', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh);

        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });

        expect(pointerInstance.outline).toBeDefined();
        expect(pointerInstance.outline).toBeInstanceOf(LineSegments);
        expect(mesh.children).toContain(pointerInstance.outline);
    });

    it('should correctly remove the outline from a deselected object', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh);

        // Select the object first
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });

        // Deselect the object
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([]);
        pointerInstance.onPointerDown({ clientX: 100, clientY: 100 });

        expect(pointerInstance.outline).toBeNull();
        expect(mesh.children).not.toContain(pointerInstance.outline);
    });

    it('should remove the outline from a previous selection when a new object is selected', () => {
        const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh1.name = 'Mesh1';
        scene.add(mesh1);

        const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        mesh2.name = 'Mesh2';
        scene.add(mesh2);

        // Select mesh1
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh1 }]);
        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });
        expect(pointerInstance.selectedObject).toBe(mesh1);
        expect(mesh1.children).toContain(pointerInstance.outline);

        const oldOutline = pointerInstance.outline; // Store reference to old outline

        // Select mesh2
        jest.spyOn(pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh2 }]);
        pointerInstance.onPointerDown({ clientX: 60, clientY: 60 });

        expect(pointerInstance.selectedObject).toBe(mesh2);
        expect(mesh2.children).toContain(pointerInstance.outline);
        expect(mesh1.children).not.toContain(oldOutline); // Old outline should be removed
    });

    it('`isDragging` flag should be true on `pointerdown` and false on `pointerup`', () => {
        expect(pointerInstance.isDragging).toBe(false);

        pointerInstance.onPointerDown({ clientX: 50, clientY: 50 });
        expect(pointerInstance.isDragging).toBe(true);

        pointerInstance.onPointerUp();
        expect(pointerInstance.isDragging).toBe(false);
    });

    it('Raycaster should be correctly updated with camera and pointer coordinates on move', () => {
        const initialPointerX = pointerInstance.pointer.x;
        const initialPointerY = pointerInstance.pointer.y;

        const newClientX = 150;
        const newClientY = 75;

        // Mock the renderer.domElement.getBoundingClientRect to simulate a canvas position
        jest.spyOn(renderer.domElement, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 200,
            height: 100,
            x: 0,
            y: 0,
            right: 200,
            bottom: 100,
            toJSON: () => ({})
        });

        // Mock the raycaster.setFromCamera method
        const setFromCameraSpy = jest.spyOn(pointerInstance.raycaster, 'setFromCamera');

        pointerInstance.onPointerMove({ clientX: newClientX, clientY: newClientY });

        // Calculate expected normalized device coordinates (NDC)
        const expectedNDC_X = (newClientX / renderer.domElement.width) * 2 - 1;
        const expectedNDC_Y = - (newClientY / renderer.domElement.height) * 2 + 1;

        expect(pointerInstance.pointer.x).toBeCloseTo(expectedNDC_X);
        expect(pointerInstance.pointer.y).toBeCloseTo(expectedNDC_Y);
        expect(setFromCameraSpy).toHaveBeenCalledWith(pointerInstance.pointer, camera);
    });

    it('Should not select an object if the pointer event started on a UI element', () => {
        const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        scene.add(mesh);

        const eventSpy = jest.spyOn(eventBus, 'emit');

        // Simulate a pointerdown event with a UI element as the target
        const uiElement = document.createElement('div');
        uiElement.id = 'ui-element';
        document.body.appendChild(uiElement);

        const mockEvent = {
            clientX: 50,
            clientY: 50,
            target: uiElement // Set the target to a UI element
        };

        pointerInstance.onPointerDown(mockEvent);

        expect(eventSpy).not.toHaveBeenCalledWith('selectionChange', expect.any(Object));
        expect(pointerInstance.selectedObject).toBeNull();

        document.body.removeChild(uiElement);
    });
});