import { Container, ContainerModule, interfaces } from 'inversify';

// Imports for App
import { App } from 'app';

// Import Types
import Types from './types';

// Imports for a modules
import { ConnectionController, ConnectionRepository, ConnectionService } from 'modules/connection';

// Utils for a method creator
import { getMethodMetadata, getMethodNames } from '@shared/helpers/metadata.util';

export const modules = [

    // Connection
    { types: Types.ConnectionRepository, className: ConnectionRepository },
    { types: Types.ConnectionController, className: ConnectionController },
    { types: Types.ConnectionService, className: ConnectionService },

    // App
    { types: Types.Application, className: App },
]

export interface IBootstrapReturn {
    appContainer: Container;
    app: App;
}


export const appBindings = new ContainerModule((bind: interfaces.Bind) => {

    // Modules Binds
    modules.forEach(async (modules) => {

        var start = new Date().getTime();

        await bind(modules.types).to(modules.className).inSingletonScope();

        var end = new Date().getTime();

        console.log("CRZ Loader", `${modules.className.name} dependencies initialized \x1b[33m[${end - start}ms]\x1b[0m`)

    })

});

function bootstrap(): IBootstrapReturn {

    console.log("CRZ Framework", "Starting bootstrap application")

    const appContainer = new Container();

    appContainer.load(appBindings);

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

                    console.log("CRZ Framework", `Registering net event ${eventName} for ${methodName} method`)

                    onNet(eventName, (...args: any[]) => {

                        binds[methodName](...args);

                    });
                }

            }
        }
    })

    const app = appContainer.get<App>(Types.Application);

    app.init();

    return { appContainer, app };
}

export const { appContainer, app } = bootstrap()
