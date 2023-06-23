import { User } from "./user";

export interface Session {
    name: string;
}

export type SessionAction = 'prepare' | 'start' | 'stop' | 'reset';
export type SessionStatus = 'notStarted' | 'preparing' | 'started' | 'stopped';

export interface SessionInfo {
    id: string;
    name: string;
    status: SessionStatus;
    configuration?: any;
    expirationTime: Date;
    users: User[];
}

export interface SessionControlInfo extends SessionInfo {
    controlId: string;
}