import { inject, injectable } from "inversify";
import { ILogger } from "@shared/helpers/logger/logger.interface";
import Types from "../../types";
import { IQueueList, IQueueService } from "./queue.service.interface";
import { onTick } from "@shared/decorator";
import { GetPlayerIdentifiers, Wait } from "@shared/helpers";

@injectable()
export class QueueService implements IQueueService {

    playerEnteringList: string[] = [];

    queueMaxUser: number = GetConvarInt("sv_maxclients", 1);

    queueList: IQueueList[];

    constructor(
        @inject(Types.ILogger) private logger: ILogger,
    ) {

        this.queueList = [];

    }

    @onTick(1000)
    async onQueueTick(): Promise<any> {

        const time = new Date().getTime();

        const queueList = this.getQueueList();

        queueList.forEach(async (user, index: number) => {

            const playerEntering = this.playerEnteringList.includes(user.steamId);

            if (!playerEntering) {

                const queueTime = (time - user.queueTime.getTime()) / 1000;

                user.deferrals.update(`You are in the queue. You have been waiting for ${queueTime} seconds.`);

                if (index === 0 && (this.getPlayerCount() + this.playerEnteringList.length) < this.queueMaxUser) {

                    this.playerEnteringList.push(user.steamId);

                    user.deferrals.update(`You are next in the queue. Please wait.`);

                    await Wait(1000);

                    user.deferrals.done();

                    this.dequeue();

                    this.playerEnteringList.splice(this.playerEnteringList.indexOf(user.steamId), 1);
                }

            }
        });
    }

    public getPlayerCount() {
        return GetNumPlayerIndices()
    }

    public enqueue(user: IQueueList): number {

        if (this.queueList.find(x => x.steamId === user.steamId)) {

            this.bubbleUp();

            return this.queueList.findIndex(x => x.steamId === user.steamId);

        }

        this.queueList.push(user);

        this.logger.log('CRZ Queue', `User ${user.steamId} has been added to the queue!`);

        this.bubbleUp();

        return this.queueList.findIndex(x => x.steamId === user.steamId);

    }

    public bubbleUp(): boolean {

        this.queueList.sort((a, b) => b.priorityPoints - a.priorityPoints);

        return true;

    }

    public dequeue(): IQueueList {

        return this.queueList.shift();

    }

    public getQueueList(): IQueueList[] {

        return this.queueList;

    }

    public getQueueListLength(): number {

        return this.queueList.length;

    }

    public getQueueListBySteamId(steamId: string): IQueueList {

        return this.queueList.find(x => x.steamId === steamId);

    }

    public getQueueListByDiscordId(discordId: string): IQueueList {

        return this.queueList.find(x => x.discordId === discordId);

    }
}