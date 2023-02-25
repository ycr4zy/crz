export interface IQueueList {
    steamId: string;
    discordId: string;
    deferrals: any;
    priorityName: string;
    priorityPoints: number;
    queueTime: Date;
}

export interface IQueueService {
    queueMaxUser: number;
    playerEnteringList: string[];
    enqueue(user: IQueueList): number;
    bubbleUp(): any;
    dequeue(): any;
    getQueueList(): any;
    getQueueListLength(): any;
    getQueueListBySteamId(steamId: string): any;
    getQueueListByDiscordId(discordId: string): any;
}