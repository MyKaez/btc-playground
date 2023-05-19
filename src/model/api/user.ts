
export interface User {
    id: string;
    name: string;
    status: UserStatus,
    configuration?: any
}

export type UserStatus = 'notReady' | 'ready';

export interface UserControl extends User {
    controlId: string;
}