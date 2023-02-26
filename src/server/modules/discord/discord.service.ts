import { Client, Message, TextChannel } from "discord.js";
import { inject, injectable } from "inversify";
import Types from "../../types";
import { ILogger } from "@shared/helpers/logger/logger.interface";
import { BotRepository } from "./discord.repository";
import { ChannelList, EmbedMessage } from "./discord.service.interface";
import { getMethodMetadata, getMethodNames } from "@shared/helpers";
import { appContainer, modules } from "index";

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
        this.client.on('messageCreate', (message) => this.onMessage(message))
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

    public async onMessage(message: Message): Promise<void> {

        modules.forEach((modules) => {

            const binds = appContainer.get<any>(modules.types);

            for (const methodName of getMethodNames(binds)) {

                const discordCommands = getMethodMetadata<string[]>(
                    "__discord_command__",
                    binds,
                    methodName
                );

                if (discordCommands) {

                    for (const eventName of discordCommands) {

                        try {

                            if (message.author.bot)
                                return;

                            if (message.content.startsWith('!')) {

                                const args = message.content.slice(1).trim().split(/ +/g);

                                const command = args.shift().toLowerCase();

                                if (command === eventName) {

                                    binds[methodName](message);

                                }
                            }

                        } catch (err) {

                            this.logger.error("CRZ Ticks", `${methodName} - ${eventName} ticks error: ${err}`)

                        }

                    }

                }
            }

        });

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