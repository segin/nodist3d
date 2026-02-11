// @ts-check

const log = (typeof window !== 'undefined' && (window.log || window.loglevel)) ? (window.log || window.loglevel) : {
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
    getLogger: () => log
};

try {
    if (log.setLevel) {
        log.setLevel('info');
    }
} catch (e) {
    console.warn('Failed to set log level:', e);
}

export default log;
