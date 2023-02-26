import { extendArrayMetadata } from "helpers"

export function onDiscordCommand<T>(commandName: string): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>
    ) => {
        extendArrayMetadata("__discord_command__", [commandName], descriptor.value);
        return descriptor;
    };
}