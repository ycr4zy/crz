export enum ChannelList {
    queueLog = "1079171530002530426",
}

export interface EmbedMessage {
    title: string;
    description: string;
    image?: { url: string };
    color: number;
}