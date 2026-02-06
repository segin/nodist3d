
import * as THREE from 'three';

declare global {
    interface SceneObject extends THREE.Mesh {
        userData: {
            geometryParams?: any;
            [key: string]: any;
        };
    }

    interface SerializedMaterial {
        color: THREE.Color;
        emissive: THREE.Color;
    }

    interface SerializedObject {
        name: string;
        type: string;
        position: THREE.Vector3;
        rotation: THREE.Euler;
        scale: THREE.Vector3;
        material: SerializedMaterial;
        geometryParams: any;
        visible: boolean;
        uuid: string;
    }

    interface SerializedScene {
        description: string;
        timestamp: number;
        objects: SerializedObject[];
        selectedObjectUuid: string | null;
    }

    interface ManagerInterface {
        init?(): void;
        update?(): void;
    }
}
