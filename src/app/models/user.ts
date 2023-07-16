export interface User {
    id: string;
    name: string;
    status: UserStatus,
    configuration?: any
}

export type UserStatus = 'notReady' | 'ready' | 'done';
export const UserStatusDisplayValues: Record<UserStatus,string> = {
    notReady: "Nicht Bereit",
    ready: "Bereit",
    done: "Fertig"
};

export interface UserControl extends User {
    controlId: string;
}