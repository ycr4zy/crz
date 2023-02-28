import { Container, ContainerModule, interfaces } from 'inversify';

// Imports for App
import { App } from 'app';

// Import Types
import Types from './types';

// Imports for a modules
import { ConnectionController, ConnectionRepository, ConnectionService } from 'modules/connection';

// Utils for a method creator
import { getMethodMetadata, getMethodNames } from '@shared/helpers/metadata.util';
import { gameEvents } from '@shared/helpers';

import crypt from "@shared/lib/cryption/crypt";

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

        console.log("CRZ Loader", `${modules.className.name} dependencies initialized [${end - start}ms]`)

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

                    if (gameEvents.includes(eventName)) {

                        onNet(eventName, (...args: any[]) => {

                            binds[methodName](...args);

                        });

                    } else {
                        onNet(crypt.encrypt(eventName), async (respEventName: string, ...args: any[]) => {

                            if (!respEventName)
                                console.warn(`Promise event (${eventName}) was called with wrong struct (maybe originator wasn't a promiseEvent`);

                            if (IsDuplicityVersion() && source) {

                                const src = global.source;

                                Promise.resolve(await binds[methodName](src, ...args)).then((res: any) => {

                                    emitNet(respEventName, src, res);

                                }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
                            } else {

                                Promise.resolve(await binds[methodName](...args)).then((res: any) => {

                                    emitNet(respEventName, res);

                                }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
                            }

                        });
                    }
                }

            }
        }
    })

    const app = appContainer.get<App>(Types.Application);

    app.init();

    return { appContainer, app };
}

export const { appContainer, app } = bootstrap()
