import { extendArrayMetadata } from "helpers"

export function onNuiEvent<T>(commandName: string): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("__cfx_nui__", [commandName], descriptor.value);
        return descriptor;
    };
}