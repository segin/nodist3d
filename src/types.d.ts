<<<<<<< HEAD
/**
 * Global type definitions
 */

import { Object3D } from 'three';

declare global {
    // JSZip is loaded globally via script tag
    var JSZip: any;

    interface Window {
        JSZip: any;
    }

    interface SceneObject extends Object3D {
=======

<<<<<<< HEAD
type SceneObject = import('three').Object3D & {
    userData: {
        geometryParams?: any;
        [key: string]: any;
    };
    geometry: import('three').BufferGeometry;
    material: import('three').Material | import('three').Material[];
};

interface SerializedObject {
    name: string;
    type: string;
    position: import('three').Vector3;
    rotation: import('three').Euler;
    scale: import('three').Vector3;
    material: {
        color: import('three').Color;
        emissive: import('three').Color;
    };
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
}

interface Window {
    JSZip: any;
}

declare function importScripts(...urls: string[]): void;
=======
import * as THREE from 'three';

declare global {
<<<<<<< HEAD
    interface SceneObject extends THREE.Object3D {
=======
    interface SceneObject extends THREE.Mesh {
>>>>>>> master
>>>>>>> master
        userData: {
            geometryParams?: any;
            [key: string]: any;
        };
    }

<<<<<<< HEAD
    interface SerializedScene {
        metadata: {
            version: number;
            type: string;
            generator: string;
        };
        geometries: any[];
        materials: any[];
        object: any;
    }

    interface ManagerInterface {
        // Basic interface for managers
    }

    // Vendor-specific Fullscreen API extensions
=======
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

>>>>>>> master
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
<<<<<<< HEAD
    }
}
=======
=======
        update?(): void;
>>>>>>> master
    }
}
>>>>>>> master
>>>>>>> master
