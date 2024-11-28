import {ObjectId} from "mongodb";


export type refreshTokenBlacklistDBModel = {
    _id: ObjectId,
    refreshToken: string,
    expiresAt: Date
};

export type Payload = {
    id: string,
    iat: number,
    exp: number
}