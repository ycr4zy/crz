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
    public test: number = 123131;

    constructor(
        @inject(Types.ILogger) public logger: ILogger,
        @inject(Types.ConnectionService) public connectionService: IConnectionService,
    ) {
    }

    @onEvent("playerConnecting")
    async onPlayerConnecting(name: string, setKickReason: Function, deferrals: any) {

        deferrals.done("You are not allowed to join this server.")

        this.logger.log(this.constructor.name, `Player ${name} is connecting`);
    }
}