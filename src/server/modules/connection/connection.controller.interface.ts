export interface IConnectionController {
    onPlayerConnecting(name: string, setKickReason: Function, deferrals: any): any;
    onPlayerReady(): any;
}