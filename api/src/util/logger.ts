import pino from 'pino';
import pinoHttp from 'pino-http';

export const logger = pino({
        level: process.env.DEVENV ? 'debug' : 'error',
        transport: {target: "pino-pretty"}
    }
);

export const httpLogger = pinoHttp({logger});