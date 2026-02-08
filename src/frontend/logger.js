<<<<<<< HEAD
// src/frontend/logger.js

// Access global loglevel instance (from CDN in browser, or mock in tests)
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
=======
<<<<<<< HEAD

// Simple logger wrapper
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
<<<<<<< HEAD
=======
=======
const log = {
>>>>>>> master
>>>>>>> master
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
<<<<<<< HEAD
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

=======
<<<<<<< HEAD
    setLevel: () => {}
};

=======
>>>>>>> master
>>>>>>> master
    setLevel: () => {},
    setDefaultLevel: () => {},
    enableAll: () => {},
    disableAll: () => {},
    methodFactory: () => {},
    getLogger: () => log,
};

<<<<<<< HEAD
if (log && log.setLevel) {
    // Wrap in try-catch in case setLevel throws or isn't a function despite check
    try {
        log.setLevel('info');
    } catch (e) {
        console.warn('Failed to set log level:', e);
    }
}

=======
<<<<<<< HEAD
if (log && log.setLevel) {
    try {
        log.setLevel('info');
    } catch (e) {
        // ignore
    }
}

=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
export default log;
