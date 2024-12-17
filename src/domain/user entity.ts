import * as mongoose from "mongoose";
import {ObjectId, WithId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";

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

export const confirmationDataSchema = new mongoose.Schema<ConfirmationDataModel>({
    confirmationCode: {type: String, require: true},
    expirationDate: {type: Date, require: true},
    status: {type: Number, require: true}
});

export const accountDetailsSchema = new mongoose.Schema<AccountDetailsModel>({
    login: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    createdAt: {type: String, require: true}
});

export const userEntity = new mongoose.Schema<WithId<UserDBType>>({
    _id: {type: ObjectId, require: true},
    accountData: accountDetailsSchema,
    emailConfirmation: confirmationDataSchema

});
export const UserModel = mongoose.model<UserDBType, UserModelType>('users', userEntity);

export type UserModelType = Model<UserDBType>;

export type UserDocument = HydratedDocument<UserDBType>;