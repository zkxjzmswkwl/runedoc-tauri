import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { handleResponseRSN } from './packethandlers/rsn';
import { handleResponseMetrics } from './packethandlers/metrics';

let incomingHandlers: Map<string, (buffer: string) => void> = new Map();
incomingHandlers.set("rsn", (buffer: string) => handleResponseRSN(buffer));
incomingHandlers.set("metrics", (buffer: string) => handleResponseMetrics(buffer));

export function setupListeners() {
    invoke("start_tcp_listener");
}

export function queuePacket(packetType: string, packetIdentifier: string, ...args: string[]) {
    invoke("queue_outgoing_packet", { packet: `${packetType}:${packetIdentifier}:${args.join(":")}<dongs>` });
}

listen<string>("packet_received", (event) => {
    var buffer = event.payload;
    if (buffer.startsWith("resp:")) {
        var spl = buffer.split(":");
        console.log(spl);
        
        if (spl.length < 3) {
            console.error("Received packet with no arguments.");
        }

        var fn = incomingHandlers.get(spl[1]);
        if (fn) {
            // Received packet contains only one argument
            if (spl.length <= 3) {
                fn(spl[2]);
            }
        }
    }
});
