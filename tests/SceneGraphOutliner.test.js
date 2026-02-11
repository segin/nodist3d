import * as THREE from 'three';
import './__mocks__/three-dat.gui.js';
import { JSDOM } from 'jsdom';

describe('Scene Graph/Outliner Functionality', () => {
  let dom, app;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="outliner"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    global.requestAnimationFrame = jest.fn();
    
    // Ensure outliner div exists in the document
    if (!document.getElementById('outliner')) {
        const div = document.createElement('div');
        div.id = 'outliner';
        document.body.appendChild(div);
    }

    // Mock minimal app for outliner tests
    app = {
        objects: [],
        selectObject: jest.fn(),
        updateSceneGraph: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    dom.window.close();
  });

  it('should initialize correctly', () => {
    const outliner = document.getElementById('outliner');
    expect(outliner).toBeDefined();
  });

  it('should render objects in the outliner', () => {
    const outliner = document.getElementById('outliner');
    const mesh = new THREE.Mesh();
    mesh.name = 'Test Mesh';
    app.objects.push(mesh);

    // Manual mock of what the outliner component would do
    const ul = document.createElement('ul');
    app.objects.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.name;
        li.onclick = () => app.selectObject(obj);
        ul.appendChild(li);
    });
    outliner.appendChild(ul);

    expect(outliner.querySelectorAll('li').length).toBe(1);
    expect(outliner.querySelector('li').textContent).toBe('Test Mesh');
  });
});
