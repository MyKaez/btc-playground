import { UserCardProps } from "src/app/shared/container/user-cards/user-cards-props";
import { UserStatus } from "src/model/api";

export interface PowOnlineUser extends UserCardProps {
    hashrate: number;    
    status: UserStatus;
}