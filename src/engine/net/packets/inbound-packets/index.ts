import { buttonPacket } from './button-packet';
import { clickPacket } from './click-packet';
import { walkPacket } from './walk-packet';
import { updateRegionPacket } from './update-region-packet';
import { commandPacket } from './command-packet';
import { npcClickPacket } from './click-npc-packet';
import { InboundPacket } from '../packets';
import { objectClickPacket } from './click-object-packet';
import { groundItemClickPacket } from './click-ground-item-packet';
import { containerItemClickPacket } from './click-container-item-packet';
import { moveContainerItemPacket } from './move-container-item-packet';
import { useItemOnItemPacket } from './use-item-on-item-packet';
import { useItemOnGroundItemPacket } from './use-item-on-ground-item-packet';
import { useItemOnNpcPacket } from './use-item-on-npc-packe';

const inboundPackets: InboundPacket[] = [
    buttonPacket,
    clickPacket,
    walkPacket,
    updateRegionPacket,
    commandPacket,
    npcClickPacket,
    objectClickPacket,
    groundItemClickPacket,
    containerItemClickPacket,
    moveContainerItemPacket,
    useItemOnItemPacket,
    useItemOnGroundItemPacket,
    useItemOnNpcPacket,
];

export default inboundPackets;
