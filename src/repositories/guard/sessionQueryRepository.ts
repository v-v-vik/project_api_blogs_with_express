import {sessionCollection} from "../db";
import {DeviceAuthSessionDBModel, DeviceViewModel} from "../../input-output-types/user auth types";

const sessionOutputMapper  = (session: DeviceAuthSessionDBModel) : DeviceViewModel => ({
    ip: session.ip,
    title: session.title,
    lastActiveDate: new Date(Number(session.lastActiveDate) * 1000).toISOString(),
    deviceId: session.deviceId

})

export const sessionQueryRepository = {
    async showAllSessions(userId: string): Promise<DeviceViewModel[]> {
        const result = await sessionCollection.find({userId}).toArray();
        return result.map((session) => sessionOutputMapper(session));


    }
}