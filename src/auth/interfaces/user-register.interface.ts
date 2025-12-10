import { User } from "../entities/user.entity";

export interface ResponseRegisterUser {
    id:string;
    email:string;
    firstName:string;
    lastName:string;
}

export interface ResponseLogin {
    user:    User;
    token:    string;
}