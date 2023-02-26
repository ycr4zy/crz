import { inject, injectable } from 'inversify';
import { IConnectionRepository } from './connection.repository.interface';
import { ConnectionCreateDTO } from './dto/connection-create.dto';
import { IConnectionService } from './connection.service.interface';
import { ConnectionEntity } from './connection.entity';
import { ILogger } from '@shared/helpers/logger/logger.interface';
import { GetPlayerIdentifiers } from "@shared/helpers"
import { Users } from '@prisma/client';
import Types from '../../types';
import { Bot } from 'modules/discord/discord.service';
import { IQueueService } from 'modules/queue/queue.service.interface';
import { ChannelList } from 'modules/discord/discord.service.interface';

@injectable()
export class ConnectionService implements IConnectionService {
    constructor(
        @inject(Types.ILogger) public logger: ILogger,
        @inject(Types.Bot) private discordService: Bot,
        @inject(Types.ConnectionRepository) private usersRepository: IConnectionRepository,
        @inject(Types.QueueService) private queueService: IQueueService,
    ) {
    }

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

        deferrals.defer();

        const source: string = String(global.source);

        const identifiers: any = GetPlayerIdentifiers(source);

        const steam: string = identifiers.steam;

        const discord: string = identifiers.discord;

        if (!steam)
            return deferrals.done("Your steam is not connected.");

        if (!discord)
            return deferrals.done("Your discord is not connected.");

        const lastEndPoint: string = GetPlayerEndpoint(source);

        const user = await this.usersRepository.find(steam);

        if (!user) {
            await this.create({ steamId: steam, licenseId: identifiers.license, discordId: discord, discordPoints: 0 });
            this.logger.log(this.constructor.name, `Player [${name}] - [${steam}] is connecting for the first time`);
        }

        if (user && user.endPoint !== lastEndPoint) {
            this.logger.log(this.constructor.name, `Player [${name}] - [${steam}] is connecting from a different endpoint`);
            await this.usersRepository.update(user.id, { endPoint: lastEndPoint, updatedAt: new Date() });
        }

        const userRoles = await this.discordService.getUserPoints(discord.replace("discord:", ""))

        if (userRoles === 0)
            return deferrals.done("You are not allowed to join this server.")

        this.logger.log(this.constructor.name, `Player [${name}] - [${steam}] is connecting with ${userRoles} points`)

        const queuePosition = this.queueService.enqueue({ steamId: steam, discordId: discord, deferrals: deferrals, priorityName: name, priorityPoints: userRoles, queueTime: new Date() })

        this.discordService.messageToChannel(ChannelList.queueLog, {
            title: "Player connecting to the server with queue",
            description: `Player [${name}] - [${steam}]\n Connecting with **${userRoles} points**\n Queue position **${queuePosition}º**`,
            color: 0x00ff00
        })
    }

    async onPlayerReady(source: string): Promise<any> {
        const identifiers: any = GetPlayerIdentifiers(source);

        const steam: string = identifiers.steam;

        const user = await this.usersRepository.find(steam);

        if (!user)
            return;

        this.logger.log(this.constructor.name, `Player [${user.id}] - [${steam}] is ready`);

        this.queueService.playerEnteringList.splice(this.queueService.playerEnteringList.indexOf(user.steamId), 1);

        this.discordService.messageToChannel(ChannelList.queueLog, {
            title: "Player ready to play",
            description: `Player [${user.id}] - [${steam}]\n Ready to play`,
            color: 0x00ff00
        })
    }
}