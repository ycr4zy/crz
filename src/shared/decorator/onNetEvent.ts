import crypt from "lib/cryption/crypt";

export function onNetEvent<T>() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
        const eventName = propertyKey;

        const eventNameCrypt = crypt.encrypt(eventName);

        onNet(eventNameCrypt, async (respEventName: string, ...args: any[]) => {
            let type = "client";

            if (!respEventName)
                console.warn(`Promise event (${eventName}) was called with wrong struct (maybe originator wasn't a promiseEvent`);

            if (IsDuplicityVersion()) {
                const src = global.source;

                if (args[0].startsWith("src:")) {
                    type = "server";
                    args[0] = args[0].replace("src:", "");
                } else {
                    type = "client";
                }

                if (type === "client")
                    Promise.resolve(descriptor.value(src, ...args)).then((res: any) => {
                        console.log("emitting to client")
                        emitNet(respEventName, src, res);
                    }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
                else
                    Promise.resolve(descriptor.value(...args)).then((res: any) => {
                        emit(respEventName, res);

                    }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
            } else {
                if (args[0] === "client") {
                    type = "server"
                    args.shift();
                } else {
                    type = "client";
                }
                if (type === "server")
                    Promise.resolve(descriptor.value(...args)).then((res: any) => {
                        emitNet(respEventName, res);
                    }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
                else
                    Promise.resolve(descriptor.value(...args)).then((res: any) => {
                        emit(respEventName, res);
                    }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
            }
        });
        return descriptor;
    };
}
