import { extendArrayMetadata } from "helpers/metadata.util";

export function onGameEvent<T>(gameEventName: string): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("__net_event__", [gameEventName], descriptor.value);
        return descriptor;
    };
}
