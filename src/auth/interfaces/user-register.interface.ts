import { User } from "../entities/user.entity";

export interface ResponseRegisterUser {
    id:string;
    email:string;
    firstName:string;
    lastName:string;
}

export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    profileImageUrl?: string;
}
export interface ResponseLogin {
    user:   UserResponse;
    token:  string;
}