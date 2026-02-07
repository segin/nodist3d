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

