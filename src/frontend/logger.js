const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
    setLevel: () => {},
    setDefaultLevel: () => {},
    enableAll: () => {},
    disableAll: () => {},
    methodFactory: () => {},
    getLogger: () => log,
};

if (log && log.setLevel) {
    // Wrap in try-catch in case setLevel throws or isn't a function despite check
    try {
        log.setLevel('info');
    } catch (e) {
        console.warn('Failed to set log level:', e);
    }
}

export default log;
