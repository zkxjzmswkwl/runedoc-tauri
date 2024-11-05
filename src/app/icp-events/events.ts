import { invoke } from '@tauri-apps/api/core';

export function setupListeners() {
  invoke('start_tcp_listener');
}

export function queuePacket(packetType: string, packetIdentifier: string, ...args: string[]) {
  invoke('queue_outgoing_packet', { packet: `${packetType}:${packetIdentifier}:${args.join(':')}<dongs>` });
}
