import { CSG } from 'three-csg-ts';
import { Events } from './constants.js';
import log from './logger.js';

export class CSGManager {
    constructor(scene, eventBus) {
        this.scene = scene;
        this.eventBus = eventBus;
    }

    performCSG(objectA, objectB, operation) {
        const bspA = CSG.fromMesh(objectA);
        const bspB = CSG.fromMesh(objectB);

        let resultBsp;
        switch (operation) {
            case 'union':
                resultBsp = bspA.union(bspB);
                break;
            case 'subtract':
                resultBsp = bspA.subtract(bspB);
                break;
            case 'intersect':
                resultBsp = bspA.intersect(bspB);
                break;
            default:
                log.warn('Unknown CSG operation:', operation);
                return null;
        }

        const resultMesh = CSG.toMesh(resultBsp, objectA.matrix);
        resultMesh.material = objectA.material;

        this.scene.remove(objectA);
        this.scene.remove(objectB);
        this.scene.add(resultMesh);

        this.eventBus.publish(Events.OBJECT_ADDED, resultMesh);
        this.eventBus.publish(Events.OBJECT_REMOVED, objectA);
        this.eventBus.publish(Events.OBJECT_REMOVED, objectB);

        return resultMesh;
    }
}
