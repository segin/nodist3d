import log from 'loglevel';

const createCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

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
    try {
      rawMethod(JSON.stringify(logObject));
    } catch (error) {
      try {
        rawMethod(JSON.stringify(logObject, createCircularReplacer()));
      } catch (err) {
        // Fallback for extremely weird cases
        rawMethod(`Failed to stringify log object: ${err.message}`);
      }
    }
  };
};

log.setLevel('info'); // Set the default log level

export default log;
