// src/frontend/worker.js
importScripts('https://unpkg.com/three@0.164.1/build/three.min.js');

self.onmessage = function(event) {
    const { type, data } = event.data;

    if (type === 'serialize') {
        // Assuming 'data' is a THREE.Scene object or a serializable representation
        try {
            const json = JSON.stringify(data);
            self.postMessage({ type: 'serialize_complete', data: json });
        } catch (error) {
            self.postMessage({ type: 'error', message: 'Serialization failed', error: error.message });
        }
    } else if (type === 'deserialize') {
        try {
            const loader = new THREE.ObjectLoader();
            const scene = loader.parse(JSON.parse(data));
            self.postMessage({ type: 'deserialize_complete', data: scene });
        } catch (error) {
            self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
        }
    }
};
