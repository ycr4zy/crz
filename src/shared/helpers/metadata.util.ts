import 'reflect-metadata';
import { iterate } from 'iterare';

export function extendArrayMetadata<T extends Array<unknown>>(
    key: string,
    metadata: T,
    target: Function
) {
    const previousValue = Reflect.getMetadata(key, target) || [];
    const value = [...previousValue, ...metadata];
    Reflect.defineMetadata(key, value, target);
}


export function getMethodMetadata<T>(
    metadataKey: string,
    prototype: object,
    target: string
): T {
    return Reflect.getMetadata(metadataKey, prototype[target]);
}


export function getMethodNames(prototype: object): string[] {
    return iterate(
        new Set(getAllFilteredMethodNames(prototype))
    ).toArray();
}

export const isFunction = (val: any): boolean => typeof val === 'function';
export const isConstructor = (val: any): boolean => val === 'constructor';

/**
 * IterableIterator to get all method's name
 * @param prototype
 */
export function* getAllFilteredMethodNames(
    prototype: object
): IterableIterator<string> {
    const isMethod = (prop: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
        if (descriptor.set || descriptor.get) {
            return false;
        }
        return !isConstructor(prop) && isFunction(prototype[prop]);
    };
    do {
        yield* iterate(Object.getOwnPropertyNames(prototype))
            .filter(isMethod)
            .toArray();
    } while (
        (prototype = Reflect.getPrototypeOf(prototype)) &&
        prototype !== Object.prototype
    );
}