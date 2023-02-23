export function onGameEvent<T>(this: any, gameEventName: string) {
    return function (target: Object, callableMethod: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        //reflect metadata
        
        onNet(gameEventName, function (...args: any[]) {
            target[callableMethod].bind(this)(...args)
        });

    }
}
