
export function GetPlayerIdentifiers(source: string): object {
    const identifiers = {
        steam: null,
        license: null,
        discord: null
    }
    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);

        if (identifier) {
            if (identifier.startsWith('steam')) {
                identifiers.steam = identifier;
            }
            else if (identifier.startsWith('license')) {
                identifiers.license = identifier;
            }
            else if (identifier.startsWith('discord')) {
                identifiers.discord = identifier;
            }
        }
    }

    return identifiers;
}