import { Client, Message } from "discord.js";
import { inject, injectable } from "inversify";
import Types from "../../types";
import { ILogger } from "@shared/helpers/logger/logger.interface";

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
    ) {
        this.client = client
        this.token = token
        this.discordServerId = discordServerId
        this.client.on('ready', () => this.onReady())
    }

    public listen(): Promise<string> {
        return this.client.login(this.token)
    }

    async checkUserRole(userId) {
        const user = await this.client.users.fetch(userId);

        const guild = await this.client.guilds.fetch(this.discordServerId);

        const member = await guild.members.fetch(user);

        return member.roles.cache;
    }

    public onReady(): void {
        this.logger.log('CRZ Queue', `User ${this.client.user.tag} has connected!`);
    }
}