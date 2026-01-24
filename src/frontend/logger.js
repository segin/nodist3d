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

export default log;
