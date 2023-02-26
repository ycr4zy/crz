import { inject, injectable } from 'inversify';
import Types from '../../types';

@injectable()
export class ConnectionService {
    constructor(
    ) {
    }

    public async onClientMapStart(): Promise<void> {

        emitNet('playerReady');

        DoScreenFadeOut(0);

    }
    
}