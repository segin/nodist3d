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

if (log && log.setLevel) {
    log.setLevel('info');
=======
// Access global log instance from window (loaded via script tag)
const log = {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    setLevel: () => {},
    getLogger: () => log
};
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
}

export default log || console; // Fallback to console if log is missing
=======
    console.warn('loglevel not loaded correctly');
}
>>>>>>> master

if (log) {
    log.setLevel('info');
} else {
    console.warn('loglevel not loaded, falling back to console');
>>>>>>> master
}

export default log || console;
>>>>>>> master
