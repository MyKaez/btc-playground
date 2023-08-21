import { User } from "./user";

export interface Session {
    name: string;
    simulationType: string;
}

export type SessionAction = 'prepare' | 'start' | 'stop' | 'reset';
export type SessionStatus = 'notStarted' | 'preparing' | 'started' | 'stopped';

export const SessionStatusDisplayValues: Record<SessionStatus, string> = {
    notStarted: "Offen",
    preparing: "In Vorbereitung",
    started: "Gestartet",
    stopped: "Gestoppt"
};

export interface SessionInfo {
    id: string;
    name: string;
    status: SessionStatus;
    configuration: any;
    expirationTime: Date;
    startTime?: Date;
    endTime?: Date;
    users: User[];
}

export interface SessionControlInfo extends SessionInfo {
    controlId: string;
}