import { HubConnection } from "@microsoft/signalr";
import { deprecate } from "util";
import { SessionInfo } from "./session";
import { UserControl } from "./user";

export class ViewModel {

    constructor(public session: SessionInfo, public connection: HubConnection) {
        this.sortUsersInSession(session);
     }

    user?: UserControl;
    userUpdates: (() => void)[] = [];

    get isSessionHost(): boolean {
        return 'controlId' in this.session;
    }

    onUsersUpdate() {
        console.log(`running ${this.userUpdates.length} updates`);
        this.userUpdates.forEach(update => update());
    }

    /** @deprecated move into streams of session */
    private sortUsersInSession(session: SessionInfo) {
        if(!session.users?.length) return;

        session.users.sort((left, right) => left.configuration?.hash && !right.configuration?.hash ? -1 : 0);
    }
}