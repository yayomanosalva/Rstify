type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

function log(level: LogLevel, ...args: any[]) {
  if (!isDev && level === 'debug') return;

  const prefix = `[${level.toUpperCase()}]`;

  switch (level) {
    case 'error':
      console.error(prefix, ...args);
      break;
    case 'warn':
      console.warn(prefix, ...args);
      break;
    default:
      console.log(prefix, ...args);
  }
}

export const logger = {
  debug: (...args: any[]) => log('debug', ...args),
  info: (...args: any[]) => log('info', ...args),
  warn: (...args: any[]) => log('warn', ...args),
  error: (...args: any[]) => log('error', ...args),
};
