import {tokenCollection} from "../db";
import {ObjectId} from "mongodb";


export const tokenRepository = {
    async isTokenBlacklisted(token: string): Promise<boolean> {
        const res = await tokenCollection.findOne({refreshToken: token});
        return !!res;
    },

    async addToken(token: string, expDate: Date) {
        const result = await tokenCollection.insertOne({
            _id: new ObjectId,
            refreshToken: token,
            expiresAt: expDate
        });
        return !!result.insertedId;

    }
}