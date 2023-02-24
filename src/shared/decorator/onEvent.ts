import { extendArrayMetadata } from "helpers/metadata.util";

export function onEvent<T>(gameEventName: string): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("__net_event__", [gameEventName], descriptor.value);
        return descriptor;
    };
}

export function on<T>(gameEventName: string): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("__event__", [gameEventName], descriptor.value);
        return descriptor;
    };
}
