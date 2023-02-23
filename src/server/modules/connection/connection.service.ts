import { inject, injectable } from 'inversify';
import { IConnectionRepository } from './connection.repository.interface';
import { ConnectionEntity } from './connection.entity';
import { IConnectionService } from './connection.service.interface';
import { Users } from '@prisma/client';
import Types from '../../types';
import { ConnectionCreateDTO } from './dto/connection-create.dto';

@injectable()
export class ConnectionService implements IConnectionService {
    constructor(
        @inject(Types.ConnectionRepository) private usersRepository: IConnectionRepository,
    ) { }

    async create({ steamId, licenseId, discordId, discordPoints }: ConnectionCreateDTO): Promise<Users | null> {

        const newUser = new ConnectionEntity(steamId, licenseId, discordId, discordPoints);

        const existedUser = await this.usersRepository.find(steamId);

        if (existedUser)
            return existedUser;

        return this.usersRepository.create(newUser);
    }

    async getUserInfo(steamId: string): Promise<Users | null> {
        return this.usersRepository.find(steamId);
    }
}