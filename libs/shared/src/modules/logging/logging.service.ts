import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logFile = 'logs/app.log';

  constructor() {
    // Ensure logs directory exists
    this.createLogsDirectory();
  }

  private async createLogsDirectory() {
    const dir = path.dirname(this.logFile);
    await fs.mkdir(dir, { recursive: true });
  }

  private async writeLog(message: string, level: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level}] ${message}\n`;
    await fs.appendFile(this.logFile, logEntry);
  }

  log(message: string) {
    console.log(message);
    this.writeLog(message, 'INFO');
  }

  error(message: string, trace?: string) {
    console.error(message);
    this.writeLog(`${message}${trace ? `\nTrace: ${trace}` : ''}`, 'ERROR');
  }

  warn(message: string) {
    console.warn(message);
    this.writeLog(message, 'WARN');
  }

  debug(message: string) {
    console.debug(message);
    this.writeLog(message, 'DEBUG');
  }
} 