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

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

const modules = [
    // Logger
    { types: Types.ILogger, className: LoggerService },
    // Prisma
    { types: Types.PrismaService, className: PrismaService },
    // ConnectionModule
    { types: Types.ConnectionController, className: ConnectionController },
    { types: Types.ConnectionService, className: ConnectionService },
    { types: Types.ConnectionRepository, className: ConnectionRepository },
    // App
    { types: Types.Application, className: App },
]

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {

    modules.forEach((modules) => {

        bind(modules.types).to(modules.className).inSingletonScope();

    })

});

function bootstrap(): IBootstrapReturn {

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

    app.init();

    return { appContainer, app };
}

export const { app, appContainer } = bootstrap();