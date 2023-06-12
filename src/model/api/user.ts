
export interface User {
    id?: string;
    name: string;
    status: UserStatus;
    avatarUrl?: string;
}

export interface ConfiguredUser<T> extends User {
    configuration: T;
}

export type UserStatus = 'notReady' | 'ready';

export interface UserControl extends User {
    controlId: string;
}