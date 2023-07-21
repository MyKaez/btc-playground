import { HubConnection } from "@microsoft/signalr";
import { SessionInfo } from "./session";
import { UserControl } from "./user";

export class ViewModel {

    constructor(public session: SessionInfo, public connection: HubConnection) { }

    user?: UserControl;
    userUpdates: (() => void)[] = [];

    get isSessionHost(): boolean {
        return 'controlId' in this.session;
    }

    onUsersUpdate() {
        this.userUpdates.forEach(update => update());
    }
}