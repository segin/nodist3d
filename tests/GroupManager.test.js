import * as THREE from 'three';
import './__mocks__/three-dat.gui.js';
import { GroupManager } from '../src/frontend/GroupManager.js';
import EventBus from '../src/frontend/EventBus.js';

describe('GroupManager', () => {
    let scene;
    let groupManager;
    let eventBus;

    beforeEach(() => {
        scene = new THREE.Scene();
        eventBus = EventBus;
        groupManager = new GroupManager(scene, eventBus);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should group objects correctly', () => {
        const mesh1 = new THREE.Mesh();
        const mesh2 = new THREE.Mesh();
        scene.add(mesh1);
        scene.add(mesh2);

        const group = groupManager.groupObjects([mesh1, mesh2]);
        expect(group.type).toBe('Group');
        expect(group.children.length).toBe(2);
        expect(scene.children).toContain(group);
        expect(scene.children).not.toContain(mesh1);
        expect(scene.children).not.toContain(mesh2);
    });

    it('should ungroup objects correctly', () => {
        const mesh1 = new THREE.Mesh();
        const mesh2 = new THREE.Mesh();
        scene.add(mesh1);
        scene.add(mesh2);
        const group = groupManager.groupObjects([mesh1, mesh2]);

        groupManager.ungroupObjects(group);
        expect(scene.children).not.toContain(group);
        expect(scene.children).toContain(mesh1);
        expect(scene.children).toContain(mesh2);
    });

    it('should maintain world position when grouping', () => {
        const mesh1 = new THREE.Mesh();
        mesh1.position.set(10, 0, 0);
        scene.add(mesh1);

        const mesh2 = new THREE.Mesh();
        mesh2.position.set(20, 0, 0);
        scene.add(mesh2);

        // Mock getWorldPosition
        mesh1.getWorldPosition = jest.fn((v) => v.set(10, 0, 0));
        mesh2.getWorldPosition = jest.fn((v) => v.set(20, 0, 0));

        const group = groupManager.groupObjects([mesh1, mesh2]);
        
        const pos1 = new THREE.Vector3();
        mesh1.getWorldPosition(pos1);
        expect(pos1.x).toBe(10);
    });
});
