import { createLogger,transports, format } from 'winston';
const { combine, timestamp, label, printf ,colorize} = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const Logger = () => {
  return createLogger({
    level: 'info',
    format: combine(
        colorize(),
      label({ label: 'Queue System' }),
      timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: '.logs/error.log', level: 'error' }),
      new transports.File({ filename: '.logs/combined.log' })
    ]
  });
};

export { Logger };
