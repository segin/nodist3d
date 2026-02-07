import loglevel from 'loglevel';

let log;

// Check for global log (browser UMD)
if (typeof window !== 'undefined' && window.log) {
  log = window.log;
} else if (loglevel && loglevel.default) {
  // ESM default export
  log = loglevel.default;
} else {
  // CommonJS or direct export
  log = loglevel;
}

// Fallback to console if loglevel is not working
if (!log || typeof log.info !== 'function') {
  console.warn('loglevel not loaded correctly, falling back to console');
  log = console;
}

if (log.setLevel) {
  log.setLevel('info');
}

export default log;
