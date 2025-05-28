// src/middleware/access-log.middleware.ts
import morgan, { TokenIndexer } from 'morgan';
import { Request, Response } from 'express';
import { logger } from '@/utils/logger.util';

const stream = {
  write: (message: string) => {
    try {
      const data = JSON.parse(message);
      logger.info(data);
    } catch {
      logger.info(message.trim());
    }
  }
};

// JSON morgan formatter
const jsonFormat = (tokens: TokenIndexer<Request, Response>, req: Request, res: Response): string => {
  return JSON.stringify({
    time: tokens.date(req, res, 'iso'),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    'response-time-ms': Number(tokens['response-time'](req, res)),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  });
};

export const accessLogMiddleware = morgan(jsonFormat, { stream });
