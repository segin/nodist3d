import * as THREE from 'three';

export class GroupManager {
    constructor(scene) {
        this.scene = scene;
    }

    groupObjects(objects) {
        if (objects.length < 2) {
            console.warn("Select at least two objects to group.");
            return null;
        }

        const group = new THREE.Group();
        group.name = "New Group";

        // Calculate the center of the selected objects
        const center = new THREE.Vector3();
        for (const object of objects) {
            center.add(object.position);
        }
        center.divideScalar(objects.length);

        // Set the group's position to the center of the objects
        group.position.copy(center);

        // Add objects to the group and adjust their positions relative to the group's new center
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

        // Move children out of the group and back to the scene, adjusting their positions
        while (group.children.length > 0) {
            const object = group.children[0];
            group.remove(object);
            this.scene.add(object);
            object.position.add(groupPosition);
            ungroupedObjects.push(object);
        }

        this.scene.remove(group);
        return ungroupedObjects;
    }
}
