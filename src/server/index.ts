import { Container, ContainerModule, interfaces } from 'inversify';
// Imports for Service
import { PrismaService } from './database/prisma.service';
import { LoggerService } from '@shared/helpers/logger/logger.service';

// Imports for Interface
import { ILogger } from '@shared/helpers/logger/logger.interface';

// Imports for App
import Types from './types';
import { App } from 'app';
import { ConnectionController } from 'modules/connection/connection.controller';
import { ConnectionService } from 'modules/connection/connection.service';
import { ConnectionRepository } from 'modules/connection/connection.repository';
export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(Types.ILogger).to(LoggerService).inSingletonScope();
    bind<PrismaService>(Types.PrismaService).to(PrismaService).inSingletonScope();
    // Connection Modules
    bind<ConnectionController>(Types.ConnectionController).to(ConnectionController).inSingletonScope();
    bind<ConnectionService>(Types.ConnectionService).to(ConnectionService).inSingletonScope();
    bind<ConnectionRepository>(Types.ConnectionRepository).to(ConnectionRepository).inSingletonScope();
    // App
    bind<App>(Types.Application).to(App);
});

function bootstrap(): IBootstrapReturn {

    const appContainer = new Container();

    appContainer.load(appBindings);

    const app = appContainer.get<App>(Types.Application);

    app.init();

    return { appContainer, app };
}

export const { app, appContainer } = bootstrap();