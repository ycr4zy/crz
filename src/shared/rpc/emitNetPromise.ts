import crypt from "lib/cryption/crypt";
import generateUUID from "lib/generateUUID";

interface IEmitNetPromise {
    source?: string
    eventName: string;
    args: any[];
}

export const emitNetPromise = <T>({ source, eventName, args }: IEmitNetPromise): Promise<T> => {
    return new Promise(async (resolve, reject) => {

        const uniqId = await generateUUID();

        const eventCrypted = await crypt.encrypt(eventName);

        const listenEventName = `${eventCrypted}:${uniqId}`;

        const handleListenEvent = (data: T) => {

            removeEventListener(listenEventName, handleListenEvent);

            if (hasTimedOut) return;

            resolve(data);
        };

        let hasTimedOut = false;

        const timeout = 5000;

        setTimeout(() => {
            hasTimedOut = true;

            removeEventListener(listenEventName, handleListenEvent);

            reject(`${listenEventName} has timed out after ${timeout} ms`);

        }, timeout);

        onNet(listenEventName, handleListenEvent);

        if (IsDuplicityVersion() && source)
            emitNet(eventCrypted, source, listenEventName, ...args);
        else
            emitNet(eventCrypted, listenEventName, ...args);
    });
}