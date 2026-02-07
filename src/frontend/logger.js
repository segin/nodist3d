// src/frontend/logger.js

// Access global loglevel instance (from CDN in browser, or mock in tests)
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    setLevel: () => {},
    getLogger: () => log,
    methodFactory: () => {},
    enableAll: () => {},
    disableAll: () => {},
    setDefaultLevel: () => {}
};

if (log && log.setLevel) {
    // Wrap in try-catch in case it's a simple console fallback
    try {
        log.setLevel('info');
    } catch (e) {
        // ignore
    }
} else {
    console.warn('loglevel not loaded correctly, falling back to console');
}

export default log;
