
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
            userId: tokenContent.userId,
            expDate: tokenContent.exp.toString()
        });
        return !!result.insertedId;

    },

    async deleteAllSessions() {
        return await sessionCollection.deleteMany({})
    },

    async terminateAllSessions(payload: Payload, currentIp: string | undefined) {
        const result = await sessionCollection.deleteMany({
            $nor: [
                {ip: currentIp, deviceId: payload.deviceId, iat: payload.iat}
            ]
        })
        return !!result


    },

    async terminateSessionById(deviceId: string) {
        const result = await sessionCollection.deleteOne({deviceId});
        return !!result
    },

    async updateSession(tokenContent: Payload, deviceId: string, userId: string, newIat: number) {
        const res = await sessionCollection.updateOne(
            {lastActiveDate:tokenContent.iat.toString(), deviceId: tokenContent.deviceId, userId},
            {
                $set: {lastActiveDate: newIat.toString(), deviceId}
            }
        );
        return res.matchedCount === 1;
    },

    async findSessionById(deviceId: string) {
        const res = await sessionCollection.findOne({deviceId});
        if (!res) {
            return null;
        }
        return res;
    }
}