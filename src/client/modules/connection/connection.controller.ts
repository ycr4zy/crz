import { inject, injectable } from 'inversify';
import Types from '../../types';

// Imports utils for the decorator
import { onEvent, onNuiEvent } from '@shared/decorator'
import { ConnectionService } from './connection.service';

@injectable()
export class ConnectionController {
    constructor(
        @inject(Types.ConnectionService) private connectionService: ConnectionService,
    ) {
    }

    @onEvent("onClientMapStart")
    async onClientMapStart() {
        return await this.connectionService.onClientMapStart();
    }

    @onEvent("onClientResourceStart")
    public async onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() != resourceName) return;

        return await this.connectionService.onClientMapStart();
    }

    @onNuiEvent("Connection.RouteChanged")
    public async onNUIConnectionTeste(data: any, cb: () => void) {
        console.log("correctly called here", data)
        cb();
    }
}
