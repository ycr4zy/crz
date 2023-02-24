import { Users } from '@prisma/client';

export interface IConnectionService {
    onPlayerConnecting(name: string, setKickReason: Function, deferrals: any): unknown;
}