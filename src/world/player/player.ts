import { Client } from '../../net/client';
import { Coord } from '../coord';
import { sendChatboxMessage, sendFriendsList, sendLogout, sendSideBarWidget, sendSidebarWidgetWithDisabledTabs, sendSkill, sendUpdateMapRegionPacket, sendWelcomeScreen, writePackets } from '../../net/packets';
import { addPlayer, removePlayer } from '../world';
import { createPlayerSyncState, PlayerSyncState, resetPlayerSyncState } from './player-sync';
import { Appearance, defaultAppearance } from './appearance';
import { createMovementQueue, MovementQueue, movementTick } from '../movement-queue';
import { Npc } from '../npc';

export enum PlayerRights {
    USER = 0,
    MOD = 1,
    JMOD = 2,
}

export interface WidgetState {
    sideBarData: number[];
}

export interface Player {
    uid: number;
    username: string;
    password: string;
    rights: PlayerRights;
    client: Client;
    coords?: Coord;
    worldIndex?: number;
    widgetState?: WidgetState;
    sync?: PlayerSyncState;
    appearance?: Appearance;
    movementQueue?: MovementQueue;
    trackedNpcs?: Npc[];
}

export const playerTick = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player ticks can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        movementTick(player);
        resolve();
    });
};

export const playerTickCleanup = async (player: Player): Promise<void> => {
    // We wrap this in a promise so that all player tick cleanups can be run
    // in parallel using Promise.all()
    return new Promise<void>(resolve => {
        resetPlayerSyncState(player);

        writePackets(player);

        resolve();
    });
};

export const playerLogin = (player: Player): boolean => {
    player.sync = createPlayerSyncState();
    player.appearance = defaultAppearance();

    player.movementQueue = createMovementQueue();

    player.trackedNpcs = [];

    player.coords = {
        x: 3222,
        y: 3222,
        plane: 0,
    };

    player.widgetState = {
        sideBarData: [ 2423, 3917, 638, 3213, 1644, 5608, 1151, 65535, 5065, 5715, 2449, 904, 147, 962 ]
    };

    sendUpdateMapRegionPacket(player); // @todo move to player sync when available - Kat 18/Oct/22
    
    sendWelcomeScreen(player);

    player.widgetState.sideBarData.forEach((id, index) => {
        sendSideBarWidget(player, index, id);
    });

    sendChatboxMessage(player, `Welcome to RS-Reborn ${player.client.connection.buildNumber}!`);
    sendFriendsList(player, 2);
    for (let i = 0; i < 20; i++) {
        if (i === 3) {
            sendSkill(player, i, 10, 1154);
        } else {
            sendSkill(player, i, 1, 0);
        }
    }
    sendSidebarWidgetWithDisabledTabs(player, 0)
    return addPlayer(player);
};

export const playerLogout = (player: Player): boolean => {
    // @todo logout packet - Kat 19/Oct/22
    sendLogout(player);
    return removePlayer(player);
};
