import { Client, Message, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import Types from "../../types";
import { ILogger } from "@shared/helpers/logger/logger.interface";
import { BotRepository } from "./discord.repository";
import { ChannelList, EmbedMessage } from "./discord.service.interface";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private readonly discordServerId: string;

    constructor(
        @inject(Types.ILogger) private logger: ILogger,
        @inject(Types.Client) client: Client,
        @inject(Types.DiscordToken) token: string,
        @inject(Types.DiscordServerId) discordServerId: string,
        @inject(Types.BotRepository) private discordRepository: BotRepository,
    ) {
        this.client = client
        this.token = token
        this.discordServerId = discordServerId
        this.client.on('ready', () => this.onReady())
    }

    public listen(): Promise<string> {
        return this.client.login(this.token)
    }

    async getUserPoints(userId) {

        let userPoints = 0

        const user = await this.client.users.fetch(userId);

        const guild = await this.client.guilds.fetch(this.discordServerId);

        const member = await guild.members.fetch(user);

        await member.roles.cache.map(role => {

            const roleCheck = this.discordRepository.discordRolePoints[Number(role.id)]

            if (roleCheck)
                userPoints += roleCheck.points;

        })

        return userPoints > 0 ? userPoints : 0;
    }

    public async messageToChannel(channelId: ChannelList, message: EmbedMessage): Promise<void> {

        const channel = this.client.channels.cache.find(ch => ch.id == channelId);

        if (channel)
            (<TextChannel>channel).send({
                embeds: [{
                    title: message.title,
                    description: message.description,
                    image: message.image,
                    color: message.color
                }]
            })
    }

    public onReady(): void {
        this.logger.log('CRZ Queue', `User ${this.client.user.tag} has connected!`);
    }
}