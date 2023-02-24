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

const modulesBind = [
    // Logger
    { types: Types.ILogger, controller: LoggerService },
    // Prisma
    { types: Types.PrismaService, controller: PrismaService },
    // connectionModule
    { types: Types.ConnectionController, controller: ConnectionController },
    { types: Types.ConnectionService, controller: ConnectionService },
    { types: Types.ConnectionRepository, controller: ConnectionRepository },
    // App
    { types: Types.Application, controller: App },
]

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    modulesBind.forEach((modules) => {
        bind(modules.types).to(modules.controller).inSingletonScope();
    })
});

function bootstrap(): IBootstrapReturn {

    const appContainer = new Container();

    appContainer.load(appBindings);

    const app = appContainer.get<App>(Types.Application);

    modulesBind.forEach((modules) => {
        const controller = appContainer.get<any>(modules.types);
        for (const methodName of getMethodNames(controller)) {
            const netEventsMetadata = getMethodMetadata<string[]>(
                "__net_event__",
                controller,
                methodName
            );
            if (netEventsMetadata) {
                for (const eventName of netEventsMetadata) {
                    onNet(eventName, (...args: any[]) => {
                        controller[methodName](...args);
                    });
                }
            }
        }
    });

    app.init();

    return { appContainer, app };
}

export const { app, appContainer } = bootstrap();