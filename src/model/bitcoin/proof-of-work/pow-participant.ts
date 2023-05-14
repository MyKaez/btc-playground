import { User } from "src/model/api";

export interface PowParticipant {
    user: User;
    cycle?: number;
    hashRate?: number;
    validHash?: string;
}