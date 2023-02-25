import { Container, ContainerModule, interfaces } from 'inversify';
// Imports for Service
import { PrismaService } from './database/prisma.service';
import { LoggerService } from '@shared/helpers/logger/logger.service';

// Imports for App
import Types from './types';
import { App } from 'app';

// Imports for Connection
import { ConnectionController } from 'modules/connection/connection.controller';
import { ConnectionService } from 'modules/connection/connection.service';
import { ConnectionRepository } from 'modules/connection/connection.repository';

// Utils for a method creator
import { getMethodMetadata, getMethodNames } from '@shared/helpers/metadata.util';

import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from 'modules/discord/discord.service';

// dotenv
import dotenv from 'dotenv';
dotenv.config();

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

const logger = new LoggerService();

const modules = [
    // Logger
    { types: Types.ILogger, className: LoggerService },
    // Prisma
    { types: Types.PrismaService, className: PrismaService },
    // ConnectionModule
    { types: Types.ConnectionController, className: ConnectionController },
    { types: Types.ConnectionService, className: ConnectionService },
    { types: Types.ConnectionRepository, className: ConnectionRepository },
    // Discord
    { types: Types.Bot, className: Bot },
    // App
    { types: Types.Application, className: App },
]

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {

    modules.forEach(async (modules) => {

        var start = new Date().getTime();

        await bind(modules.types).to(modules.className).inSingletonScope();

        var end = new Date().getTime();

        logger.log("CRZ Loader", `${modules.className.name} dependencies initialized \x1b[33m[${end - start}ms]\x1b[0m`)

    })

    // Discord Binds

    bind<Client>(Types.Client).toConstantValue(new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ]
    }))

    bind<string>(Types.DiscordToken).toConstantValue(process.env.DISCORD_TOKEN)

    bind<string>(Types.DiscordServerId).toConstantValue(process.env.DISCORD_SERVERID)

});

async function bootstrap(): Promise<IBootstrapReturn> {

    logger.log("CRZ Framework", "Starting bootstrap application")

    const appContainer = new Container();

    appContainer.load(appBindings);

    const app = appContainer.get<App>(Types.Application);

    modules.forEach((modules) => {

        const binds = appContainer.get<any>(modules.types);

        for (const methodName of getMethodNames(binds)) {

            const netEventsMetadata = getMethodMetadata<string[]>(
                "__net_event__",
                binds,
                methodName
            );

            if (netEventsMetadata) {

                for (const eventName of netEventsMetadata) {
                    onNet(eventName, (...args: any[]) => {

                        binds[methodName](...args);

                    });
                }

            }

            const eventsMetadata = getMethodMetadata<string[]>(
                "__event__",
                binds,
                methodName
            );

            if (eventsMetadata) {

                for (const eventName of eventsMetadata) {

                    on(eventName, (...args: any[]) => {

                        binds[methodName](...args);

                    });

                }

            }
        }

    });

    await app.init();

    return { appContainer, app };
}

onNet("onResourceStart", (resourceName: string) => {
    if (GetCurrentResourceName() !== resourceName)
        return;

    setTimeout(async () => {
        const { appContainer, app } = await bootstrap();
        appContainer && app && logger.log("CRZ Framework", `⚡️ Bootstrap application successfully started`);
    }, 500)
})