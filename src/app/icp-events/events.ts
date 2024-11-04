import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/core';
import {handleResponseRSN} from './packethandlers/rsn';
import {handleResponseMetrics} from './packethandlers/metrics';

const incomingHandlers: Map<string, (buffer: string) => void> = new Map([
  ['rsn', (buffer: string) => handleResponseRSN(buffer)],
  ['metric', (buffer: string) => handleResponseMetrics(buffer)],
]);

export function setupListeners() {
  invoke("start_tcp_listener");
}

export function queuePacket(packetType: string, packetIdentifier: string, ...args: string[]) {
  invoke("queue_outgoing_packet", {packet: `${packetType}:${packetIdentifier}:${args.join(":")}<dongs>`});
}

listen<string>("packet_received", (event) => {
  const buffer = event.payload;

  if (!buffer.startsWith("resp:")) {
    return;
  }

  const spl = buffer.split(":");
  console.log(spl);

  if (spl.length < 3) {
    console.error("Received packet with no arguments.");
  }

  const handler = incomingHandlers.get(spl[1]);
  if (!handler || spl.length <= 3) {
    return;
  }

  handler(spl[2]);
});
