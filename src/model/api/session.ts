import { SessionStatus } from "./session-status";

export interface Session {    
    id: string;
    name: string;
    status: SessionStatus;
    configuration?: any;
    expirationTime: Date;
}