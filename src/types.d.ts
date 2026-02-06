
import * as THREE from 'three';

declare global {
<<<<<<< HEAD
    interface SceneObject extends THREE.Object3D {
=======
    interface SceneObject extends THREE.Mesh {
>>>>>>> master
        userData: {
            geometryParams?: any;
            [key: string]: any;
        };
    }

<<<<<<< HEAD
=======
    interface SerializedMaterial {
        color: THREE.Color;
        emissive: THREE.Color;
    }

>>>>>>> master
    interface SerializedObject {
        name: string;
        type: string;
        position: THREE.Vector3;
        rotation: THREE.Euler;
        scale: THREE.Vector3;
<<<<<<< HEAD
        material: {
            color: THREE.Color;
            emissive: THREE.Color;
        };
=======
        material: SerializedMaterial;
>>>>>>> master
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
<<<<<<< HEAD
        update?(deltaTime: number): void;
    }

    interface Document {
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
    }

    interface HTMLElement {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
=======
        update?(): void;
>>>>>>> master
    }
}
