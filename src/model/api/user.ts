
export interface User {
    id: string;
    name: string;
    status: UserStatus;
    configuration?: any;
    avatarUrl?: string;
}

export type UserStatus = 'notReady' | 'ready';

export interface UserControl extends User {
    controlId: string;
}