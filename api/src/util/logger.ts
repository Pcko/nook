import pino from 'pino';
import pinoHttp from 'pino';

export const logger = pino();
export const httpLogger = pinoHttp({ logger });
