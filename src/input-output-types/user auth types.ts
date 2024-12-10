import {ObjectId} from "mongodb";


export type UserDBType = {
    _id: ObjectId;
    accountData: AccountDetailsModel,
    emailConfirmation: ConfirmationDataModel
}

export type AccountDetailsModel = {
    login: string;
    email: string;
    password: string;
    createdAt: string
}

export type ConfirmationDataModel = {
    confirmationCode: string;
    expirationDate: Date;
    status: number;
}

export enum AccountStatusCodes {
    notConfirmed = 0,
    confirmed = 1
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

// export type MeViewModel = {
//     email: string;
//     login: string;
//     userId: string;
// }

// export type LoginSuccessViewModel = {
//     accessToken: string;
// }

export type RegistrationEmailResendingModel = {
    email: string;
}

export type DeviceViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;

}

export type DeviceAuthSessionDBModel = {
    _id: ObjectId,
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
    userId: string;
};

export type RequestLogDBModel = {
    ip: string;
    url: string;
    date: Date;

}