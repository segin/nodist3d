import { Scene, Mesh, BoxGeometry, MeshBasicMaterial, Group } from 'three';
import { GroupManager } from '../src/frontend/GroupManager.js';
import { EventBus } from '../src/frontend/EventBus.js';

describe('GroupManager', () => {
    let scene;
    let groupManager;
    let eventBus;
    let object1, object2, object3;

    beforeEach(() => {
        scene = new Scene();
        eventBus = new EventBus();
        groupManager = new GroupManager(scene, eventBus);

        object1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        object1.position.set(1, 0, 0);
        object1.name = 'Object1';
        scene.add(object1);

        object2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        object2.position.set(2, 0, 0);
        object2.name = 'Object2';
        scene.add(object2);

        object3 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        object3.position.set(3, 0, 0);
        object3.name = 'Object3';
        scene.add(object3);
    });

    it('should successfully group two or more objects', () => {
        const group = groupManager.groupObjects([object1, object2]);
        expect(group).toBeInstanceOf(Group);
        expect(scene.children).toContain(group);
        expect(group.children).toContain(object1);
        expect(group.children).toContain(object2);
        expect(scene.children).not.toContain(object1);
        expect(scene.children).not.toContain(object2);
    });

    it('should refuse to create a group with fewer than two objects', () => {
        const group = groupManager.groupObjects([object1]);
        expect(group).toBeNull();
        expect(scene.children).toContain(object1);
    });

    it('should correctly calculate the center of the grouped objects for the group\'s position', () => {
        const group = groupManager.groupObjects([object1, object2, object3]);
        // Expected center: (1+2+3)/3 = 2
        expect(group.position.x).toBeCloseTo(2);
        expect(group.position.y).toBeCloseTo(0);
        expect(group.position.z).toBeCloseTo(0);
    });

    it('should successfully ungroup a group of objects', () => {
        const group = groupManager.groupObjects([object1, object2]);
        groupManager.ungroupObjects(group);
        expect(scene.children).not.toContain(group);
        expect(scene.children).toContain(object1);
        expect(scene.children).toContain(object2);
    });

    it('should place ungrouped objects back into the scene at the correct world positions', () => {
        const group = groupManager.groupObjects([object1, object2]);
        group.position.set(10, 10, 10); // Move the group
        groupManager.ungroupObjects(group);

        // Object1 was at (1,0,0) relative to scene, now it should be at (1+10, 0+10, 0+10) = (11,10,10)
        expect(object1.position.x).toBeCloseTo(11);
        expect(object1.position.y).toBeCloseTo(10);
        expect(object1.position.z).toBeCloseTo(10);

        // Object2 was at (2,0,0) relative to scene, now it should be at (2+10, 0+10, 0+10) = (12,10,10)
        expect(object2.position.x).toBeCloseTo(12);
        expect(object2.position.y).toBeCloseTo(10);
        expect(object2.position.z).toBeCloseTo(10);
    });

    it('should handle a request to ungroup an object that is not a group', () => {
        const ungrouped = groupManager.ungroupObjects(object1);
        expect(ungrouped).toEqual([]);
        expect(scene.children).toContain(object1);
    });

    it('should allow grouping a group with another object', () => {
        const group1 = groupManager.groupObjects([object1, object2]);
        const object4 = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        object4.name = 'Object4';
        scene.add(object4);

        const group2 = groupManager.groupObjects([group1, object4]);

        expect(group2).toBeInstanceOf(Group);
        expect(scene.children).toContain(group2);
        expect(group2.children).toContain(group1);
        expect(group2.children).toContain(object4);
        expect(scene.children).not.toContain(group1);
        expect(scene.children).not.toContain(object4);
    });

    it('should correctly handle ungrouping a nested group, restoring all objects to the scene', () => {
        const meshA = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        meshA.name = 'MeshA';
        const meshB = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        meshB.name = 'MeshB';
        const meshC = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
        meshC.name = 'MeshC';

        scene.add(meshA, meshB, meshC);

        const innerGroup = groupManager.groupObjects([meshA, meshB]);
        innerGroup.name = 'InnerGroup';

        const outerGroup = groupManager.groupObjects([innerGroup, meshC]);
        outerGroup.name = 'OuterGroup';

        expect(scene.children).toContain(outerGroup);
        expect(scene.children).not.toContain(innerGroup);
        expect(scene.children).not.toContain(meshA);
        expect(scene.children).not.toContain(meshB);
        expect(scene.children).not.toContain(meshC);

        groupManager.ungroupObjects(outerGroup);

        expect(scene.children).not.toContain(outerGroup);
        expect(scene.children).not.toContain(innerGroup);
        expect(scene.children).toContain(meshA);
        expect(scene.children).toContain(meshB);
        expect(scene.children).toContain(meshC);

        expect(meshA.parent).toBe(scene);
        expect(meshB.parent).toBe(scene);
        expect(meshC.parent).toBe(scene);
    });
});