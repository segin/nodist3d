
// Simple logger wrapper
const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    trace: console.trace,
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
};

export default log;
