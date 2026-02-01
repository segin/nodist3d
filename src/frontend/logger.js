const log = (typeof window !== 'undefined' && window.log) ? window.log : {
    info: console.log,
    warn: console.warn,
    error: console.error,
    setLevel: () => {}
};

if (log && log.setLevel) {
    log.setLevel('info');
}

export default log;
