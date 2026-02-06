<<<<<<< HEAD
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
// Simple console wrapper to replace broken loglevel UMD import
=======
<<<<<<< HEAD
// import log from 'loglevel';
// Use global log object from script tag because ESM import fails for UMD build
const log = window.log;
=======
<<<<<<< HEAD
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    info: console.log,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
};
>>>>>>> master

if (log && log.setLevel) {
    log.setLevel('info');
=======
<<<<<<< HEAD
// Access global log instance from window (loaded via script tag)
=======
<<<<<<< HEAD
// Access global loglevel instance
=======
<<<<<<< HEAD
// loglevel loaded as global script in index.html
=======
<<<<<<< HEAD
// Custom logger implementation to replace loglevel due to ESM issues
>>>>>>> master
const log = {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
<<<<<<< HEAD
    setLevel: () => {},
    getLogger: () => log
};
=======
    setLevel: (level) => {
        // No-op for now, or implement level filtering if needed
        console.log(`Logger level set to ${level} (not implemented)`);
    }
};
=======
<<<<<<< HEAD
// Access global log instance from window (loaded via script tag)
>>>>>>> master
>>>>>>> master
>>>>>>> master
const log = window.log;
>>>>>>> master
>>>>>>> master

if (log) {
    log.setLevel('info'); // Set the default log level
} else {
<<<<<<< HEAD
    console.error('loglevel not loaded!');
=======
<<<<<<< HEAD
    console.error('loglevel not loaded globally');
>>>>>>> master
>>>>>>> master
}

export default log || console; // Fallback to console if log is missing
=======
<<<<<<< HEAD
    console.warn('loglevel not loaded correctly');
}
=======
    console.error('loglevel not loaded globally');
=======
// Access loglevel from global scope (loaded via script tag)
const log = window.log;
>>>>>>> master
>>>>>>> master

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
}

export default log || console;
>>>>>>> master
