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
};

export default log;
