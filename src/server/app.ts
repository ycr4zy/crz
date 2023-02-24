import { inject, injectable } from 'inversify';
// Imports for service
import { PrismaService } from './database/prisma.service';
// Imports for interface
import { ILogger } from '@shared/helpers/logger/logger.interface';
// Imports for Controller
import { ConnectionController } from 'modules/connection/connection.controller';

import Types from './types';
import 'reflect-metadata';

@injectable()
export class App {
    constructor(
        @inject(Types.ILogger) private logger: ILogger,
        @inject(Types.PrismaService) private prismaService: PrismaService,
        @inject(Types.ConnectionController) private connectionController: ConnectionController,
    ) {
    }

    public async init(): Promise<void> {
        await this.prismaService.connect();
    }
}