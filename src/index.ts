import winston from 'winston';
import expressWinston from 'express-winston';

// Formats.
const timestampKafkaFormat = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });
const timestampConsoleFormat = winston.format.timestamp({ format: 'HH:mm:ss' });

const logFormat = winston.format.printf((log) => {
    return `${log.timestamp} ${log.level} ${log.message}`;
});
const requestLogFormat = winston.format.printf((log) => {
    return `[${log.level}] ${log.timestamp} ${log.message}`;
});

const uppercaseLevelFormat = winston.format((log) => {
    log.level = log.level.toUpperCase();
    return log;
})();

// Default logger.
const logger = winston.createLogger({
    format: winston.format.combine(uppercaseLevelFormat),
    transports: [
        // TODO: Implement custom kafka transports.
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), timestampConsoleFormat, requestLogFormat)
        })
    ]
});

// HTTP request logger.
const requestLogger = expressWinston.logger({
    format: winston.format.combine(
        uppercaseLevelFormat, winston.format.colorize(), timestampConsoleFormat, requestLogFormat
    ),
    transports: [ new winston.transports.Console() ],
    meta: false,
    msg: '{{req.method}} {{res.statusCode}} {{req.url}} {{res.responseTime}}ms',
    expressFormat: false,
    colorize: true
});

export { logger, requestLogger };
