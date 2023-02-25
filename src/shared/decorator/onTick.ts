import { extendArrayMetadata } from "helpers"

export function onTick<T>(tickMs: number): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("ticks", [tickMs], descriptor.value);
        return descriptor;
    };
}