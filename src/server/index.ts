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
import { BotRepository } from 'modules/discord/discord.repository';
import { QueueService } from 'modules/queue/queue.service';
import { Wait } from '@shared/helpers';
dotenv.config();

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

const logger = new LoggerService();

export const modules = [
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
    { types: Types.BotRepository, className: BotRepository },
    // Queue
    { types: Types.QueueService, className: QueueService },
    // App
    { types: Types.Application, className: App },
]

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {

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

    // Modules Binds
    modules.forEach(async (modules) => {

        var start = new Date().getTime();

        await bind(modules.types).to(modules.className).inSingletonScope();

        var end = new Date().getTime();

        logger.log("CRZ Loader", `${modules.className.name} dependencies initialized \x1b[33m[${end - start}ms]\x1b[0m`)

    })

});

function bootstrap(): IBootstrapReturn {

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

            const ticksMetadata = getMethodMetadata<number[]>(
                "ticks",
                binds,
                methodName
            );

            if (ticksMetadata) {

                for (const waitTime of ticksMetadata) {

                    try {

                        setTick(async () => {

                            await Wait(waitTime)

                            binds[methodName]();

                        });

                    } catch (err) {

                        logger.error("CRZ Ticks", `${methodName} - ${waitTime} ticks error: ${err}`)

                    }

                }

            }
        }

    });

    app.init();

    return { appContainer, app };
}

export const { appContainer, app } = bootstrap()