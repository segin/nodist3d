import { Scene, Mesh, BoxGeometry, PointLight, Group } from 'three';
import { SceneGraph } from '../src/frontend/SceneGraph.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

describe('SceneGraph', () => {
    let scene;
    let uiElement;
    let transformControls;
    let updateGUI;
    let sceneGraph;

    beforeEach(() => {
        scene = new Scene();
        uiElement = document.createElement('div');
        transformControls = new TransformControls(new THREE.Camera(), document.createElement('canvas'));
        updateGUI = jest.fn();
        sceneGraph = new SceneGraph(scene, uiElement, transformControls, updateGUI);
    });

    it('should display all mesh and light objects from the scene in the UI', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'TestMesh';
        scene.add(mesh);

        const light = new PointLight();
        light.name = 'TestLight';
        scene.add(light);

        sceneGraph.update();

        expect(uiElement.innerHTML).toContain('TestMesh');
        expect(uiElement.innerHTML).toContain('TestLight');
    });

    it('should not display objects other than meshes and lights', () => {
        const group = new Group();
        group.name = 'TestGroup';
        scene.add(group);

        sceneGraph.update();

        expect(uiElement.innerHTML).not.toContain('TestGroup');
    });

    it('should correctly rename an object in the scene', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'OldName';
        scene.add(mesh);
        sceneGraph.update();

        const renameInput = uiElement.querySelector('input[type="text"]');
        renameInput.value = 'NewName';
        renameInput.dispatchEvent(new Event('change'));

        expect(mesh.name).toBe('NewName');
        expect(uiElement.innerHTML).toContain('NewName');
        expect(uiElement.innerHTML).not.toContain('OldName');
    });

    it('should attach the transform controls when an object is clicked in the scene graph', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'ClickableMesh';
        scene.add(mesh);
        sceneGraph.update();

        const nameSpan = uiElement.querySelector('span');
        nameSpan.click();

        expect(transformControls.object).toBe(mesh);
        expect(updateGUI).toHaveBeenCalledWith(mesh);
    });

    it('should delete an object from the scene when the delete button is clicked', () => {
        const mesh = new Mesh(new BoxGeometry(), new THREE.MeshBasicMaterial());
        mesh.name = 'DeletableMesh';
        scene.add(mesh);
        sceneGraph.update();

        const deleteButton = uiElement.querySelector('button');
        deleteButton.click();

        expect(scene.children).not.toContain(mesh);
        expect(transformControls.object).toBeUndefined(); // Detached
        expect(updateGUI).toHaveBeenCalledWith(null);
        expect(uiElement.innerHTML).not.toContain('DeletableMesh');
    });
});