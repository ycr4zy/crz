import { inject, injectable } from 'inversify';

import Types from '../../types';
//  Imports interfaces for the controller
import { ILogger } from "@shared/helpers/logger/logger.interface";
import { IConnectionController } from './connection.controller.interface';
import { IConnectionService } from './connection.service.interface';
// Imports utils for the decorator
import { onEvent } from '@shared/decorator'

@injectable()
export class ConnectionController implements IConnectionController {
    constructor(
        @inject(Types.ILogger) public logger: ILogger,
        @inject(Types.ConnectionService) public connectionService: IConnectionService,
    ) {
    }

    @onEvent("playerConnecting")
    async onPlayerConnecting(name: string, setKickReason: Function, deferrals: any) {
        return await this.connectionService.onPlayerConnecting(name, setKickReason, deferrals);
    }
}