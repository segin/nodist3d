import log from 'loglevel';

const originalFactory = log.methodFactory;
log.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);

    return (message, ...args) => {
        const logObject = {
            timestamp: new Date().toISOString(),
            level: methodName,
            message,
            extra: args,
        };
        rawMethod(JSON.stringify(logObject));
    };
};

log.setLevel('info'); // Set the default log level

export default log;
