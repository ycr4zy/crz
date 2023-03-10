import { inject, injectable } from 'inversify';
import Types from '../../types';
import { emitNetPromise } from '@shared/helpers/';

@injectable()
export class ConnectionService {
    constructor(
    ) {
    }

    public async onClientMapStart(): Promise<void> {

        DoScreenFadeOut(1500);

        const ready = await emitNetPromise({ eventName: 'Connection::PlayerReady', type: "server", args: [] })

        DoScreenFadeIn(1500);

        //Example call to a NUI

        SendNUIMessage({
            action: "Change:Route",
            name: "Connection",
            message: {
                route: "/"
            }
        })
    }
}