import { getCurrentWindow } from '@tauri-apps/api/window';
import { StateManager } from '../../statemanager';

export function handleResponseRSN(rsn: string) {
    const stateManager = StateManager.getInstance();

    var accounts = stateManager.get("accounts");
    if (typeof accounts === "undefined") {
        stateManager.set("accounts", [rsn]);
    }
    if (Array.isArray(accounts)) {
        accounts.push(rsn);
        stateManager.set("accounts", accounts);
    }

    getCurrentWindow().setTitle(rsn);
}
