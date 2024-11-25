import {ObjectId} from "mongodb";


export type UserDBType = {
    _id?: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: string
}

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string
}

export type UserInputModel = {
    login: string;
    password: string;
    email: string;
}

export type LoginInputModel = {
    loginOrEmail: string;
    password: string;
}

export type MeViewModel = {
    email: string;
    login: string;
    userId: string;
}

export type LoginSuccessViewModel = {
    accessToken: string;
}