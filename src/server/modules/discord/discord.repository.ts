import { injectable } from 'inversify';

@injectable()
export class BotRepository {
    
    public discordAllowedRole: number = 1078848605890281482;

    public discordRolePoints: { [key: number]: { name: string, points: number } } = {

        [1078848605890281482]: {
            name: "Membro",
            points: 1
        },

        [1079160895600590990]: {
            name: "Prioridade 1",
            points: 10
        },

    }

}