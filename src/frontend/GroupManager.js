import * as THREE from 'three';

export class GroupManager {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.eventBus = eventBus;
    }

    groupObjects(objects) {
        if (objects.length < 2) {
            console.warn("Select at least two objects to group.");
            return null;
        }

        const group = new THREE.Group();
        group.name = 'Group';

        const center = new THREE.Vector3();
        const positions = objects.map(obj => obj.position);
        center.addVectors(...positions).divideScalar(objects.length);
        group.position.copy(center);

        for (const object of objects) {
            this.scene.remove(object);
            group.add(object);
            object.position.sub(center);
        }

        this.scene.add(group);
        return group;
    }

    ungroupObjects(group) {
        if (!group || !(group instanceof THREE.Group)) {
            console.warn("Invalid group provided for ungrouping.");
            return [];
        }

        const ungroupedObjects = [];
        const groupPosition = group.position.clone();

        while (group.children.length > 0) {
            const object = group.children[0];
            group.remove(object);
            this.scene.add(object);
            object.position.add(groupPosition);
            ungroupedObjects.push(object);
        }

        this.scene.remove(group);
        this.eventBus.publish('groupRemoved', group); // Emit event
        return ungroupedObjects;
    }
}