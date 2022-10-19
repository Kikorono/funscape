import { Client } from '../net/client';
import { Coord } from './coord';
import { sendSideBarWidget, sendUpdateMapRegionPacket } from '../net/packets';

export enum PlayerRights {
    USER = 0,
    MOD = 1,
    JMOD = 2,
}


export interface Player {
    uid: number;
    username: string;
    password: string;
    rights: PlayerRights;
    client: Client;
    position?: Coord;
    sideBarData: number[];
}

export const playerLogin = (player: Player): void => {
    player.position = {
        x: 3222,
        y: 3222,
        plane: 0,
    };

    player.sideBarData = [ 2423, 3917, 638, 3213, 1644, 5608, 1151, 65535, 5065, 5715, 2449, 904, 147, 962 ];

    sendUpdateMapRegionPacket(player); // @todo move to player sync when available - Kat 18/Oct/22
    
    player.sideBarData.forEach((id, index) => {
        sendSideBarWidget(player, index, id);
    })
};
