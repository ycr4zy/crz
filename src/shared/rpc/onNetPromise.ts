import crypt from "lib/cryption/crypt";

export const onNetPromise = async <T>(
    eventName: string,
    func: (source?: number, ...args: any[]) => Promise<T> | T
): Promise<void> => {
    const eventNameCrypt = await crypt.encrypt(eventName);
    onNet(eventNameCrypt, async (respEventName: string, ...args: any[]) => {
        if (!respEventName)
            console.warn(`Promise event (${eventName}) was called with wrong struct (maybe originator wasn't a promiseEvent`);

        if (IsDuplicityVersion() && source) {

            const src = global.source;

            Promise.resolve(await func(src, ...args)).then((res: T) => {

                emitNet(respEventName, src, res);

            }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
        } else {

            Promise.resolve(await func(...args)).then((res: T) => {

                emitNet(respEventName, res);

            }).catch(err => console.error(`An error occured for a onNetPromise (${eventName}), Error: ${err.message}`));
        }
    });
}