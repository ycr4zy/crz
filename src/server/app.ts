import { inject, injectable } from 'inversify';
// Imports for service
import { PrismaService } from './database/prisma.service';
// Imports for interface
import { ILogger } from '@shared/helpers/logger/logger.interface';

import Types from './types';
import 'reflect-metadata';

@injectable()
export class App {
    constructor(
        @inject(Types.ILogger) private logger: ILogger,
        @inject(Types.PrismaService) private prismaService: PrismaService,
    ) {
    }

    public async init(): Promise<void> {
        await this.prismaService.connect();

        this.logger.log(this.constructor.name, `⚡️ Server is running`);
    }
}