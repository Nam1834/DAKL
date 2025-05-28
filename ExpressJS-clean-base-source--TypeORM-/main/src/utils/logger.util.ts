// utils/logger.util.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';
import { GlobalConfig } from './config/global-config.util';

const logDir = path.resolve('logs');

// Custom formatter giống dòng log trong hình
const customFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label || 'app'}.${level.toUpperCase()}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: 'api' }), // tùy chỉnh theo module
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    customFormat
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

// Log ra console có màu khi không phải production

if (GlobalConfig.enviroment !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.label({ label: 'api' }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        customFormat
      )
    })
  );
}
