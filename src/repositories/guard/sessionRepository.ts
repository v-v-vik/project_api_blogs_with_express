import {SessionModel} from "../../domain/session entity";
import {Payload} from "../../input-output-types/auth types";


export const sessionRepository = {
    async tokenListed(tokenContent: Payload): Promise<boolean> {
        const res = await SessionModel.findOne({
            lastActiveDate: tokenContent.iat.toString(),
            deviceId: tokenContent.deviceId,
            userId: tokenContent.userId
        });
        return !!res;
    },

    async addSession(tokenContent: Payload, ip: string, userAgent: string, deviceId: string) {
        const result = await SessionModel.create({
            ip,
            title: userAgent,
            lastActiveDate: tokenContent.iat.toString(),
            deviceId,
            userId: tokenContent.userId,
            expDate: tokenContent.exp.toString()
        });
        return !!result.id;

    },

    async deleteAllSessions() {
        return SessionModel.deleteMany({})
    },

    async terminateAllSessions(payload: Payload) {
        const result = await SessionModel.deleteMany({
            $and: [
                {deviceId: { $ne: payload.deviceId}},
                {iat: { $ne: payload.iat}}
            ]
        })
        return !!result


    },

    async terminateSessionById(deviceId: string) {
        const result = await SessionModel.deleteOne({deviceId});
        return !!result
    },

    async updateSession(tokenContent: Payload, newIat: number) {
        const res = await SessionModel.updateOne(
            {lastActiveDate:tokenContent.iat.toString(), deviceId: tokenContent.deviceId, userId:tokenContent.userId},
            {
                $set: {lastActiveDate: newIat.toString()}
            }
        );
        return res.matchedCount === 1;
    },

    async findSessionById(deviceId: string) {
        const res = await SessionModel.findOne({deviceId});
        if (!res) {
            return null;
        }
        return res;
    }
}