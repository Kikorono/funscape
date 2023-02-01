import { playerSyncEncoders } from '../player-sync-encoder';
import { appendAppearanceData } from '../player-sync-appearance';
import { getLocalCoord } from '../../../../../world';
import { playerUpdateRequired } from '../../../../../world/player';

// @todo finish update flag enum - Kat 15/Nov/22
enum UpdateFlags {
    APPEARANCE_UPDATE = 0x8,
}

playerSyncEncoders[414] = {
    packetOpcode: 225,

    updateMaskEncoder: (player, data, forceAppearanceUpdate = false) => {
        let flags = 0;

        // @todo append all flags - Kat 15/Nov/22
        const { appearanceUpdate } = player.sync;
        if (appearanceUpdate || forceAppearanceUpdate) {
            flags |= UpdateFlags.APPEARANCE_UPDATE;
        }

        if (flags >= 0x40) {
            flags |= 0x20;
            data.put(flags & 0xff);
            data.put(flags >> 8);
        } else {
            data.put(flags);
        }

        if (appearanceUpdate || forceAppearanceUpdate) {
            appendAppearanceData(player, 414, data);
        }
    },

    mapRegionUpdateEncoder: (player, data) => {
        const localCoord = getLocalCoord(player.coords);

        // Map region update required
        data.putBits(1, 1);
        // Map region changed (movement type - 0=none, 1=walk, 2=run, 3=mapchange
        data.putBits(2, 3);

        // Local Y coord
        data.putBits(7, localCoord.x);

        // Whether an update flag block follows
        data.putBits(1, playerUpdateRequired(player) ? 1 : 0);

        // Local X coord
        data.putBits(7, localCoord.y);

        // Whether the client should discard the current walking queue (1 if teleporting, 0 if not)
        data.putBits(1, player.sync.teleporting ? 1 : 0);

        // Local plane coord
        data.putBits(2, localCoord.plane);
    },

    appendNewlyTrackedPlayer: (data, player, otherPlayer) => {
        const xPos = otherPlayer.coords.x - player.coords.x;
        const yPos = otherPlayer.coords.y - player.coords.y;
        data.putBits(11, otherPlayer.worldIndex + 1);
        data.putBits(1, 1);
        data.putBits(5, xPos);
        data.putBits(1, 1);
        data.putBits(5, yPos);
    },
};

