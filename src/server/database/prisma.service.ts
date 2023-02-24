import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '@shared/helpers/logger/logger.interface';
import Types from '../types';
import 'reflect-metadata';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(Types.ILogger) private logger: ILogger) {
        this.client = new PrismaClient({
            log: ['query'],
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log("CRZ Database", 'Successfully connected to database');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error("CRZ Database", 'Error to connected database: ' + e.message);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}