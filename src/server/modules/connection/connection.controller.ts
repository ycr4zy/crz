import { inject, injectable } from 'inversify';

import { ILogger } from "@shared/helpers/logger/logger.interface";

import Types from '../../types';
import { IConnectionController } from './connection.controller.interface';
import { IConnectionService } from './connection.service.interface';

import { onGameEvent, onNetEvent } from '@shared/decorator'

@injectable()
export class ConnectionController implements IConnectionController {
    public test: number = 123131;

    constructor(
        @inject(Types.ILogger) public logger: ILogger,
        @inject(Types.ConnectionService) public connectionService: IConnectionService,
    ) {
        this.logger.log(this.constructor.name, "Initiated")
    }

    @onGameEvent("playerConnecting")
    async onPlayerConnecting(name: string, setKickReason: Function, deferrals: any) {

        deferrals.done("You are not allowed to join this server.")

        console.log(this.test)

        this.logger.log(this.constructor.name, `Player ${name} is connecting`);

        //await this.connectionService.onPlayerConnecting(name, setKickReason, deferrals);
    }
}