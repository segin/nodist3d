// @ts-check
// src/frontend/worker.js

self.onmessage = function (event) {
  const { type, data, buffers: inputBuffers } = event.data;

  if (type === 'serialize') {
    try {
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

    } catch (error) {
      self.postMessage({ type: 'error', message: 'Deserialization failed', error: error.message });
    }
  }
};
