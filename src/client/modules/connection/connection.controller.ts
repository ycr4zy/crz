import { inject, injectable } from 'inversify';
import Types from '../../types';

// Imports utils for the decorator
import { onEvent } from '@shared/decorator'
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
}
