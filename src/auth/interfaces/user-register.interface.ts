export interface ResponseRegisterUser {
    email:string;
    firstName:string;
    lastName:string;
}

export interface ResponseLogin {
    id:       string;
    firstName:string;
    lastName:string;
    email:    string;
    token:    string;
}