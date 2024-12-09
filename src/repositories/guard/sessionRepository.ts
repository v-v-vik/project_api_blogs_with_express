
import {ObjectId} from "mongodb";
import {sessionCollection} from "../db";
import {Payload} from "../../input-output-types/token";


export const sessionRepository = {
    async tokenListed(tokenContent: Payload): Promise<boolean> {
        const res = await sessionCollection.findOne({
            lastActiveDate: tokenContent.iat.toString(),
            deviceId: tokenContent.deviceId,
            userId: tokenContent.userId
        });
        return !!res;
    },

    async addSession(tokenContent: Payload, ip: string, userAgent: string, deviceId: string) {
        const result = await sessionCollection.insertOne({
            _id: new ObjectId,
            ip,
            title: userAgent,
            lastActiveDate: tokenContent.iat.toString(),
            deviceId,
            userId: tokenContent.userId
        });
        return !!result.insertedId;

    }
}