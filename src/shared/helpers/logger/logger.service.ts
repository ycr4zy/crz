import { injectable } from 'inversify';
import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger;
    constructor() {
        this.logger = new Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false,
        });
    }

    log(...args: unknown[]): void {
        const argsFormatted = "\x1b[33m[" + args[0] + "]\x1b[0m"
        this.logger.info(argsFormatted, ...args.slice(1));
    }

    error(...args: unknown[]): void {
        const argsFormatted = "\x1b[33m[" + args[0] + "]\x1b[0m"
        this.logger.error(argsFormatted, ...args.slice(1));
    }

    warn(...args: unknown[]): void {
        const argsFormatted = "\x1b[33m[" + args[0] + "]\x1b[0m"
        this.logger.warn(argsFormatted, ...args.slice(1));
    }
}