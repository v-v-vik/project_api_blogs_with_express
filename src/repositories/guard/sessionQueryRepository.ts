import {sessionCollection} from "../db";

const sessionOutputMapper = (session: any)=> ({
    ip: session.ip,
    title: session.ip,
    lastActiveDate: session.lastActiveDate,
    deviceId: session.deviceId

})

export const sessionQueryRepository = {
    async showAllSessions() {
        const result = await sessionCollection.find({});
        return sessionOutputMapper(result);
    }
}