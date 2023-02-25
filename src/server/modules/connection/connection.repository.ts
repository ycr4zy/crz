import { Users } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { IConnectionRepository } from './connection.repository.interface';
import { ConnectionEntity } from './connection.entity';

import Types from '../../types';

@injectable()
export class ConnectionRepository implements IConnectionRepository {
    constructor(@inject(Types.PrismaService) private prismaService: PrismaService) { }

    async create({ steamId, licenseId, discordId, discordPoints }: ConnectionEntity): Promise<Users> {
        return this.prismaService.client.users.create({
            data: {
                steamId,
                licenseId,
                discordId,
                discordPoints,
                updatedAt: new Date(),
                createdAt: new Date(),
            },
        });
    }

    async find(steamId: string): Promise<Users | null> {
        return this.prismaService.client.users.findFirst({
            where: {
                steamId
            },
        });
    }

    async update(id: number, value: any): Promise<Users> {
        return this.prismaService.client.users.update({
            where: {
                id
            },
            data: value,
        });
    }
}