import * as THREE from 'three';
import { Pointer } from '../src/frontend/Pointer.js';
import EventBus from '../src/frontend/EventBus.js';

describe('Pointer', () => {
  let camera;
  let scene;
  let renderer;
  let eventBus;
  const mockEvent = { clientX: 0, clientY: 0, target: null };

  beforeEach(() => {
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    scene = new THREE.Scene();
    renderer = {
      domElement: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 200,
          height: 100,
          x: 0,
          y: 0,
          right: 200,
          bottom: 100,
          toJSON: () => ({}),
        }),
      },
      get size() {
        return { width: 100, height: 100 };
      },
    };
    eventBus = EventBus;

    // Mock window
    global.window = {
      innerWidth: 200,
      innerHeight: 100,
    };

    global.pointerInstance = new Pointer(camera, scene, renderer, eventBus);
    mockEvent.target = renderer.domElement;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    EventBus.events = {};
  });

  it('should dispatch a `selectionChange` event when an object is selected', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    const callback = jest.fn();
    EventBus.subscribe('selectionChange', callback);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);

    const event = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(event);

    expect(callback).toHaveBeenCalledWith(mesh);
    expect(global.pointerInstance.selectedObject).toBe(mesh);
  });

  it('should dispatch `selectionChange` with a null payload on deselection', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
    const downEvent = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(downEvent);

    const callback = jest.fn();
    EventBus.subscribe('selectionChange', callback);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([]);
    const upEvent = { clientX: 100, clientY: 100, target: renderer.domElement };
    global.pointerInstance.onPointerDown(upEvent);

    expect(callback).toHaveBeenCalledWith(null);
    expect(global.pointerInstance.selectedObject).toBeNull();
  });

  it('should correctly apply an outline to a selected object', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
    const event = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(event);

    expect(global.pointerInstance.outline).toBeDefined();
    // Use loose check or check if LineSegments if properly mocked
    expect(global.pointerInstance.outline.type).toBe('LineSegments');
    expect(mesh.children).toContain(global.pointerInstance.outline);
  });

  it('should correctly remove the outline from a deselected object', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh }]);
    const downEvent = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(downEvent);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([]);
    const upEvent = { clientX: 100, clientY: 100, target: renderer.domElement };
    global.pointerInstance.onPointerDown(upEvent);

    expect(global.pointerInstance.outline).toBeNull();
    expect(mesh.children).not.toContain(global.pointerInstance.outline);
  });

  it('should remove the outline from a previous selection when a new object is selected', () => {
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    mesh1.name = 'Mesh1';
    scene.add(mesh1);

    const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    mesh2.name = 'Mesh2';
    scene.add(mesh2);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh1 }]);
    const downEvent1 = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown.call(global.pointerInstance, downEvent1);

    expect(global.pointerInstance.selectedObject).toBe(mesh1);
    expect(mesh1.children).toContain(global.pointerInstance.outline);

    const oldOutline = global.pointerInstance.outline;

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([{ object: mesh2 }]);
    const downEvent2 = { clientX: 60, clientY: 60, target: renderer.domElement };
    global.pointerInstance.onPointerDown.call(global.pointerInstance, downEvent2);

    expect(global.pointerInstance.selectedObject).toBe(mesh2);
    expect(mesh2.children).toContain(global.pointerInstance.outline);
    expect(mesh1.children).not.toContain(oldOutline);
  });

  it('`isDragging` flag should be true on `pointerdown` and false on `pointerup`', () => {
    expect(global.pointerInstance.isDragging).toBe(false);

    const downEvent = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(downEvent);
    expect(global.pointerInstance.isDragging).toBe(true);

    global.pointerInstance.onPointerUp.call(global.pointerInstance);
    expect(global.pointerInstance.isDragging).toBe(false);
  });

  it('Raycaster should be correctly updated with camera and pointer coordinates on move', () => {
    const newClientX = 150;
    const newClientY = 75;

    const setFromCameraSpy = jest.spyOn(global.pointerInstance.raycaster, 'setFromCamera');

    const moveEvent = { clientX: newClientX, clientY: newClientY };
    global.pointerInstance.onPointerMove(moveEvent);

    const expectedNDC_X = (newClientX / window.innerWidth) * 2 - 1;
    const expectedNDC_Y = -(newClientY / window.innerHeight) * 2 + 1;

    expect(global.pointerInstance.pointer.x).toBeCloseTo(expectedNDC_X);
    expect(global.pointerInstance.pointer.y).toBeCloseTo(expectedNDC_Y);
    expect(setFromCameraSpy).toHaveBeenCalledWith(global.pointerInstance.pointer, camera);
  });

  it('Should not select an object if the pointer event started on a UI element', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    scene.add(mesh);

    const callback = jest.fn();
    EventBus.subscribe('selectionChange', callback);

    const uiElement = document.createElement('div');
    uiElement.id = 'ui-element';
    document.body.appendChild(uiElement);

    const mockEvent = {
        clientX: 50,
        clientY: 50,
        target: uiElement
    };

    global.pointerInstance.onPointerDown(mockEvent);

    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(uiElement);
  });

  it('`removeOutline` should not throw an error if called when no outline exists', () => {
    global.pointerInstance.outline = null;
    expect(() => {
      global.pointerInstance.removeOutline();
    }).not.toThrow();
  });

  it('Raycasting should correctly identify the front-most object if multiple are overlapping', () => {
    const meshFront = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    meshFront.position.set(0, 0, 0);
    meshFront.name = 'MeshFront';
    scene.add(meshFront);

    const meshBack = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    meshBack.position.set(0, 0, -2);
    meshBack.name = 'MeshBack';
    scene.add(meshBack);

    jest.spyOn(global.pointerInstance.raycaster, 'intersectObjects').mockReturnValue([
      { object: meshFront, distance: 1 },
      { object: meshBack, distance: 3 },
    ]);

    const callback = jest.fn();
    EventBus.subscribe('selectionChange', callback);

    const event = { clientX: 50, clientY: 50, target: renderer.domElement };
    global.pointerInstance.onPointerDown(event);

    expect(callback).toHaveBeenCalledWith(meshFront);
    expect(global.pointerInstance.selectedObject).toBe(meshFront);
  });
});
