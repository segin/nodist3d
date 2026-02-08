// @ts-check
// src/frontend/worker.js
<<<<<<< HEAD

// @ts-ignore
importScripts('/modules/three.min.js');
=======
>>>>>>> master

self.onmessage = function (event) {
  const { type, data } = event.data;

  if (type === 'serialize') {
    // Assuming 'data' is a THREE.Scene object or a serializable representation
    try {
      // We use a custom replacer to convert TypedArrays (transferred from main thread)
      // back to regular arrays for standard JSON serialization.
      const json = JSON.stringify(data, (key, value) => {
        if (value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined) {
          return Array.from(value);
        }
        return value;
      });
      self.postMessage({ type: 'serialize_complete', data: json });
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Serialization failed', error: error.message });
    }
  } else if (type === 'deserialize') {
    try {
      // @ts-ignore
      const loader = new THREE.ObjectLoader();
      const scene = loader.parse(JSON.parse(data));
      self.postMessage({ type: 'deserialize_complete', data: scene });
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
    }
  }
};
