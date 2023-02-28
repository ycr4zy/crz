import { Users } from '@prisma/client';

export interface IConnectionService {
    onPlayerConnecting(name: string, setKickReason: Function, deferrals: any): unknown;
    onPlayerReady(source: string): unknown;
    onPlayerDropped(source: string, reason: string): any;
}