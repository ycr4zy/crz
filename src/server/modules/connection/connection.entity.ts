export class ConnectionEntity {
    
    public id?: number

    public createdAt?: Date

    public updatedAt?: Date

    constructor(
        private readonly _steamId: string,
        private readonly _licenseId: string,
        private readonly _discordId: string,
        private readonly _discordPoints: number,
    ) { }


    get steamId(): string {
        return this._steamId
    }

    get licenseId(): string {
        return this._licenseId
    }

    get discordId(): string {
        return this._discordId
    }

    get discordPoints(): number {
        return this._discordPoints
    }
}