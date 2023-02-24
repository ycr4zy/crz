import { inject, injectable } from 'inversify';
import { IConnectionRepository } from './connection.repository.interface';
import { ConnectionCreateDTO } from './dto/connection-create.dto';
import { IConnectionService } from './connection.service.interface';
import { ConnectionEntity } from './connection.entity';
import { ILogger } from '@shared/helpers/logger/logger.interface';
import { Users } from '@prisma/client';
import Types from '../../types';

@injectable()
export class ConnectionService implements IConnectionService {
    constructor(
        @inject(Types.ILogger) public logger: ILogger,
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

    async onPlayerConnecting(name: string, setKickReason: Function, deferrals: any): Promise<any> {

        this.logger.log(this.constructor.name, `Player ${name} is connecting`);

        deferrals.done("You are not allowed to join this server.")
    }
}