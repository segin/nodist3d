// @ts-check
// src/frontend/worker.js

self.onmessage = function (event) {
  const { type, data } = event.data;

  if (type === 'serialize') {
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
        // Only perform JSON parsing in the worker
        const sceneObject = JSON.parse(data);
        self.postMessage({ type: 'deserialize_complete', data: sceneObject });
    } catch (error) {
        self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
    }
  }
};
