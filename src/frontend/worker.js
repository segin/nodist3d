// @ts-check
// src/frontend/worker.js
=======
// @ts-ignore
importScripts('/modules/three.min.js');
>>>>>>> master

self.onmessage = function (event) {
  const { type, data } = event.data;

<<<<<<< HEAD
  if (type === 'serialize') {
    // Assuming 'data' is a THREE.Scene object or a serializable representation
    try {
      const json = JSON.stringify(data);
      self.postMessage({ type: 'serialize_complete', data: json });
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Serialization failed', error: error.message });
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
            // Only perform JSON parsing in the worker
            const sceneObject = JSON.parse(data);
            self.postMessage({ type: 'deserialize_complete', data: sceneObject });
        } catch (error) {
            self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
        }
>>>>>>> master
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
