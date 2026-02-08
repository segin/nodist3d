<<<<<<< HEAD
const log = {
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    setLevel: () => {},
    setDefaultLevel: () => {},
    enableAll: () => {},
    disableAll: () => {},
    methodFactory: () => {},
    getLogger: () => log,
>>>>>>> master
>>>>>>> master

const log = window.log || window.loglevel || {
    trace: console.trace,
    debug: console.debug,
    info: console.log,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
>>>>>>> master
};

if (window.log || window.loglevel) {
    log.setLevel('info');
} else {
    console.warn('Loglevel not loaded, falling back to console');
}
=======
// Simple replacement for loglevel to avoid UMD/ESM issues
const levels = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5
};

let currentLevel = levels.INFO;
>>>>>>> master

const log = {
    levels,
    setLevel: (level) => {
        if (typeof level === 'string' && levels[level.toUpperCase()] !== undefined) {
            currentLevel = levels[level.toUpperCase()];
        } else if (typeof level === 'number') {
            currentLevel = level;
        }
    },
    trace: (...args) => {
        if (currentLevel <= levels.TRACE) console.trace(...args);
    },
    debug: (...args) => {
        if (currentLevel <= levels.DEBUG) console.debug(...args);
    },
    info: (...args) => {
        if (currentLevel <= levels.INFO) console.info(...args);
    },
    warn: (...args) => {
        if (currentLevel <= levels.WARN) console.warn(...args);
    },
    error: (...args) => {
        if (currentLevel <= levels.ERROR) console.error(...args);
    }
};
=======
<<<<<<< HEAD
// src/frontend/logger.js

// Access global loglevel instance (from CDN in browser, or mock in tests)
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
=======
<<<<<<< HEAD
>>>>>>> master

// Simple logger wrapper
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
=======
<<<<<<< HEAD
// Access global log instance from window (loaded via script tag)
const log = {
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
>>>>>>> master
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
<<<<<<< HEAD
=======
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
>>>>>>> master
    setLevel: () => {},
    getLogger: () => log,
    methodFactory: () => {},
    enableAll: () => {},
    disableAll: () => {},
    setDefaultLevel: () => {}
};
<<<<<<< HEAD
>>>>>>> master
>>>>>>> master
const log = window.log;
>>>>>>> master
>>>>>>> master

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
    console.error('loglevel not loaded!');
>>>>>>> master
=======

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
>>>>>>> master
}

=======
<<<<<<< HEAD
    console.warn('loglevel not loaded correctly');
}
>>>>>>> master

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
=======
<<<<<<< HEAD
if (log && log.setLevel) {
    try {
        log.setLevel('info');
    } catch (e) {
        // ignore
    }
>>>>>>> master
}

=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
>>>>>>> master
export default log;
