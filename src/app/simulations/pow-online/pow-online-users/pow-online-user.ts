import { UserCardProps } from "src/app/shared/container/user-cards/user-cards-props";
import { ConfiguredUser, UserStatus } from "src/model/api";

export interface PowUser extends ConfiguredUser<PowUserConfiguration>, UserCardProps {}

export interface PowUserConfiguration {
    hashrate: string;
    cycle: number;
    hashes: number;
}