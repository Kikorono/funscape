import { ByteBuffer } from '@runejs/common';
import { OutboundPacket } from '../../packets';

interface WidgetData {
    widgetId: number;
}

export const showWidgetPlayerHeadPacket: OutboundPacket<WidgetData> = {
    name: 'widgetPlayerHead',
    opcodes: {
        319: 252,
    },
    encoders: {
        319: (player, opcode, data) => {
            const buffer = new ByteBuffer(2);
            buffer.put(data.widgetId, 'short', 'le');
            return buffer;
        }
    },
};