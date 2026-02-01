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
        userData: {
            geometryParams?: any;
            [key: string]: any;
        };
    }

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
}
