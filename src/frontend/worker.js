// @ts-check
// src/frontend/worker.js
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD

// @ts-ignore
importScripts('/modules/three.min.js');
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master

self.onmessage = function (event) {
  const { type, data, buffers: inputBuffers } = event.data;

  if (type === 'serialize') {
    try {
<<<<<<< HEAD
      const buffers = [];
      const json = JSON.stringify(data, (key, value) => {
        if (value && ArrayBuffer.isView(value) && !(value instanceof DataView)) {
            buffers.push(value.buffer); // Store the underlying buffer
            return {
                __type: 'TypedArray',
                id: buffers.length - 1,
                ctor: value.constructor.name,
                byteOffset: value.byteOffset,
                length: value.length
            };
        }
        return value;
      });

      // Transfer the buffers to avoid copying
      // Only unique buffers
      const uniqueBuffers = [...new Set(buffers)];

      self.postMessage({
          type: 'serialize_complete',
          data: json,
          buffers: buffers // Pass the array of buffers (can contain duplicates if views share buffer)
      }, uniqueBuffers); // Transfer ownership of unique buffers

    } catch (error) {
      self.postMessage({ type: 'error', message: 'Serialization failed', error: error.message });
    }
  } else if (type === 'deserialize') {
    try {
      // inputBuffers is an array of ArrayBuffers (or TypedArrays if not transferred)
      const reconstructed = JSON.parse(data, (key, value) => {
          if (value && value.__type === 'TypedArray' && typeof value.id === 'number') {
              const buffer = inputBuffers[value.id];
              const Ctor = self[value.ctor] || Float32Array;

              if (buffer instanceof ArrayBuffer) {
                  return new Ctor(buffer, value.byteOffset, value.length);
              } else if (ArrayBuffer.isView(buffer)) {
                  // If it's already a view, we might need to slice it or just use it?
                  // If we transferred it, it should be an ArrayBuffer.
                  // If we cloned it, it might be a view.
                  // Let's assume inputBuffers contains ArrayBuffers as intended.
                  return new Ctor(buffer.buffer, value.byteOffset, value.length);
              }
              return buffer;
          }
          return value;
      });

      self.postMessage({ type: 'deserialize_complete', data: reconstructed });

=======
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
            const json = JSON.stringify(data, (key, value) => {
                // Convert TypedArrays to standard Arrays for JSON compatibility
                // This allows passing TypedArrays from the main thread (optimization)
                if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
>>>>>>> master
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
=======
>>>>>>> master
    }
  } else if (type === 'deserialize') {
    try {
      // @ts-ignore
      const loader = new THREE.ObjectLoader();
      const scene = loader.parse(JSON.parse(data));
      self.postMessage({ type: 'deserialize_complete', data: scene });
>>>>>>> master
    } catch (error) {
      self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
    }
  }
};
