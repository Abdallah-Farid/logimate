const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message, details = null) => {
  const timestamp = getTimestamp();
  const formattedMessage = `[${timestamp}] ${level}: ${message}`;
  
  if (details) {
    console.group(formattedMessage);
    console.log('Details:', details);
    console.groupEnd();
  } else {
    console.log(formattedMessage);
  }
};

export const logError = (error, context = '') => {
  const message = error instanceof Error ? error.message : error;
  formatMessage(LOG_LEVELS.ERROR, `${context} ${message}`, error);
};

export const logWarn = (message, details = null) => {
  formatMessage(LOG_LEVELS.WARN, message, details);
};

export const logInfo = (message, details = null) => {
  formatMessage(LOG_LEVELS.INFO, message, details);
};

export const logDebug = (message, details = null) => {
  if (process.env.NODE_ENV === 'development') {
    formatMessage(LOG_LEVELS.DEBUG, message, details);
  }
};
