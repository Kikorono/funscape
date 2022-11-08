import { Socket } from 'net';
import { ByteBuffer, logger } from '@runejs/common';
import BigInteger from 'bigi';
import { SocketOptions } from './server';
import { Isaac } from './isaac';
import { Player, playerLogin, PlayerRights } from '../world/player';
import { handleInboundPacket } from './packets';
import { handleUpdateRequests } from './file-server';
import INBOUND_PACKET_SIZES from './packets/inbound-packet-sizes';

const RSA_EXPONENT = BigInteger('85749236153780929917924872511187713651124617292658988978182063731979923800090977664547424642067377984001222110909310620040899943594191124988795815431638577479242072599794149649824942794144264088097130432112910214560183536387949202712729964914726145231993678948421001368196284315651219252190430508607437712749');
const RSA_MODULUS = BigInteger('85851413706447406835286856960321868491021158946959045519533110967212579875747603892534938950597622190034801837526749417278303359405620369366942839883641648688111135276342550236485518612241524546375576253238379707601227775510104577557183947475438430283206434950768729692944226445159468674814615586984703672433');

export enum ConnectionType {
    GAME = 14,
    UPDATE = 15,
}

export enum ConnectionState {
    UPDATE = 'update',
    LOGIN = 'login_type',
    LOGGED_IN = 'logged_in',
}

export interface Connection {
    socket: Socket;
    connectionType?: ConnectionType;
    connectionState?: ConnectionState;
    serverKey?: bigint;
    clientKey1?: number;
    clientKey2?: number;
    buildNumber?: number;
    player?: Player;
}

const handleInboundPacketData = (
    player: Player,
    buffer?: ByteBuffer,
): void => {
    let packet = player.client.inboundPacket;

    if (!packet) {
        player.client.inboundPacket = packet = {
            opcode: null,
            size: null,
            buffer,
        };
    } else {
        if (!packet.buffer) {
            packet.buffer = buffer;
        } else if (buffer) {
            const readable = packet.buffer.readable;
            const newBuffer = new ByteBuffer(readable + buffer.length);
            packet.buffer.copy(newBuffer, 0, packet.buffer.readerIndex);
            buffer.copy(newBuffer, readable, 0);
            packet.buffer = newBuffer;
        }
    }

    if (packet.opcode === null) {
        packet.opcode = -1;
    }

    if (packet.size === null) {
        packet.size = -1;
    }

    const inCipher = player.client.inCipher;

    if (packet.opcode === -1) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.opcode = packet.buffer.get('byte', 'u');
        packet.opcode = (packet.opcode - inCipher.rand()) & 0xff;
        packet.size = INBOUND_PACKET_SIZES[String(player.client.connection.buildNumber)]?.[String(packet.opcode)] ?? -3;
    }

    // Variable length packet
    if (packet.size === -1) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.size = packet.buffer.get('byte', 'u');
    }

    let clearBuffer = false;
    if (packet.size === -3) {
        if (packet.buffer.readable < 1) {
            // Waiting for more data
            return;
        }

        packet.size = packet.buffer.readable;
        clearBuffer = true;
    }

    if (packet.buffer.readable < packet.size) {
        // Waiting for more data
        return;
    }

    // Read packet data
    let packetData = null;
    if (packet.size !== 0) {
        packetData = new ByteBuffer(packet.size);
        packet.buffer.copy(packetData, 0, packet.buffer.readerIndex,
            packet.buffer.readerIndex + packet.size);
        packet.buffer.readerIndex += packet.size;
    }

    if (!handleInboundPacket(player, packet.opcode, packetData)) {
        logger.error(`Unhandled packet ${packet.opcode}.`);
        clearBuffer = true;
    }

    if (clearBuffer) {
        packet.buffer = null;
    }

    // Reset the pending packet in preparation for another one
    packet.opcode = null;
    packet.size = null;

    if (packet.buffer !== null && packet.buffer.readable > 0) {
        handleInboundPacketData(player);
    }
};

const dataReceived = (connection: Connection, data?: Buffer): void => {
    if (!data?.length) {
        // No data received
        return;
    }

    const buffer = new ByteBuffer(data || []);
    const { socket, connectionState, serverKey } = connection;
    let connectionType = connection.connectionType;

    const RESPONSE_OK = Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0 ]);

    if (!connectionType) {
        // Initial handshake
        connectionType = connection.connectionType = buffer.get('byte', 'u');

        if (connectionType === ConnectionType.GAME) {
            buffer.get('byte', 'u'); // byte name hash (unused by us)

            connection.serverKey = BigInt(Math.floor(Math.random() * 999999));

            const response = new ByteBuffer(17);
            response.putBytes(RESPONSE_OK);
            response.put(0); // response code - 0 for OK
            response.put(connection.serverKey, 'long');
            socket.write(response.toNodeBuffer());
            connection.connectionState = ConnectionState.LOGIN;
        } else if (connectionType === ConnectionType.UPDATE) {
            if (buffer.readable >= 2) {
                connection.buildNumber = buffer.get('short', 'u');
                logger.info(`On demand build ${connection.buildNumber}.`);
            }
            socket.write(RESPONSE_OK);
            connection.connectionState = ConnectionState.UPDATE;
        } else {
            logger.error(`Invalid connection type ${connectionType} received.`);
        }
    } else {
        // Post-handshake
        if (connectionState === ConnectionState.UPDATE) {
            // Update server request
            handleUpdateRequests(connection, buffer);
        } else if (connectionState === ConnectionState.LOGIN) {
            // Login type
            const loginOpcode = buffer.get('byte', 'u');
            if (loginOpcode !== 16 && loginOpcode !== 18) {
                logger.error(`Invalid login opcode ${loginOpcode} received!`);
                return;
            }

            const loginPacketSize = buffer.get('byte', 'u');
            let encryptedPacketSize = loginPacketSize - (36 + 1 + 1 + 2);
            const magicNumber = buffer.get('byte', 'u');

            if (magicNumber !== 255) {
                logger.error(`Invalid magic number ${magicNumber} received!`);
                return;
            }

            connection.buildNumber = buffer.get('short', 'u');
            // @todo ensure build is supported - Kat 2/Nov/22

            const lowMemory = buffer.get('byte', 'u') === 1;

            // Cache checksums
            for (let i = 0; i < 9; i++) {
                // @todo verify these against the cache - Kat 2/Nov/22
                buffer.get('int');
            }

            // The encrypted size includes the size byte which we don't need.
            encryptedPacketSize--;

            const reportedSize = buffer.get('byte', 'u');
            if (encryptedPacketSize !== reportedSize) {
                logger.error(`Encrypted login packet size mismatch; calculated ${encryptedPacketSize} vs reported ${reportedSize}!`);
                return;
            }

            const encryptedBytes: Buffer = Buffer.alloc(reportedSize);
            buffer.copy(encryptedBytes, 0, buffer.readerIndex);
            const decrypted = new ByteBuffer(BigInteger.fromBuffer(encryptedBytes)
                .modPow(RSA_EXPONENT, RSA_MODULUS).toBuffer());

            const blockId = decrypted.get('byte', 'u');

            if (blockId !== 10) {
                logger.error(`Invalid block id ${blockId} encountered!`);
                return;
            }

            const clientKey1 = connection.clientKey1 = decrypted.get('int');
            const clientKey2 = connection.clientKey2 = decrypted.get('int');
            const incomingServerKey = decrypted.get('long');

            if(serverKey !== incomingServerKey) {
                logger.error(`Server key mismatch; original ${serverKey} vs reported ${incomingServerKey}!`);
                return;
            }

            const uid = decrypted.get('int');
            const username = decrypted.getString(10);
            const password = decrypted.getString(10);
            const rights = PlayerRights.JMOD; // @todo - Kat 18-Oct-22

            const sessionKey: number[] = [
                Number(clientKey1),
                Number(clientKey2),
                Number(incomingServerKey >> BigInt(32)),
                Number(incomingServerKey)
            ];

            const inCipher = new Isaac(sessionKey);

            for (let i = 0; i < 4; i++) {
                sessionKey[i] += 50;
            }

            const outCipher = new Isaac(sessionKey);

            const outputBuffer = new ByteBuffer(3);
            outputBuffer.put(2); // login response code
            outputBuffer.put(rights); // player role/rights
            outputBuffer.put(0); // ??? still dunno what the fuck this is
            socket.write(outputBuffer.toNodeBuffer());

            connection.player = {
                uid,
                username,
                password,
                rights,
                client: {
                    lowMemory,
                    inCipher,
                    outCipher,
                    connection,
                    outboundPacketQueue: [],
                    outboundSyncQueue: [],
                },
            };

            connection.connectionState = ConnectionState.LOGGED_IN;

            playerLogin(connection.player);
            logger.info(`Player ${username} has logged in.`);
        } else if (connectionState === ConnectionState.LOGGED_IN) {
            // Packet data received
            handleInboundPacketData(connection.player, buffer);
        } else {
            logger.error(`Unhandled connection state ${connectionState} encountered.`);
        }
    }
};

const connectionClosed = (connection: Connection, hadError: boolean): void => {

};

const connectionError = (connection: Connection, error: Error): void => {

};

export const connectionCreated = (
    socket: Socket,
    socketOptions?: SocketOptions,
): Connection => {
    const connection: Connection = { socket };

    socket.setNoDelay(socketOptions?.noDelay ?? true);
    socket.setKeepAlive(socketOptions?.keepAlive ?? true);
    socket.setTimeout(socketOptions?.timeout ?? 30000);

    socket.on('data', data => dataReceived(connection, data));
    socket.on('close', hadError => connectionClosed(connection, hadError));
    socket.on('error', error => connectionError(connection, error));

    return connection;
};
