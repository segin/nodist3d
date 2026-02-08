<<<<<<< HEAD
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    trace: (...args) => console.trace(...args),
    debug: (...args) => console.debug(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
=======
const log = {
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
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
    try {
        log.setLevel('info');
    } catch (e) {
        // ignore
    }
}

=======
>>>>>>> master
export default log;
