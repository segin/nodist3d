
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
