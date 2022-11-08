import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface SideBarData {
    sidebarId: number;
}

export const flashSidebarIconPacket: OutboundPacket<SideBarData> = {
    name: 'flashSideBarIcon',
    opcodes: {
        319: 168,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(1);
            buffer.put(data.sidebarId, 'byte');
            return buffer;
        }
    },
};
