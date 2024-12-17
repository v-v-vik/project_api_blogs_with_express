import {SessionDBType, SessionModel, SessionViewModel} from "../../domain/session entity";


const sessionOutputMapper  = (session: SessionDBType) : SessionViewModel => ({
    ip: session.ip,
    title: session.title,
    lastActiveDate: new Date(Number(session.lastActiveDate) * 1000).toISOString(),
    deviceId: session.deviceId

})

export const sessionQueryRepository = {
    async showAllSessions(userId: string): Promise<SessionViewModel[]> {
        const result = await SessionModel.find({userId}).lean();
        return result.map((session) => sessionOutputMapper(session));


    }
}