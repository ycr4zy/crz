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

        const teste = await emitNetPromise({ eventName: 'Connection::PlayerReady', type: "server", args: [] })

        console.log('testing return from netPromise with crypt -> ',teste)

        DoScreenFadeIn(1500);

    }
}