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
    try {
        log.setLevel('info');
    } catch (e) {
        // ignore
    }
}

export default log;
