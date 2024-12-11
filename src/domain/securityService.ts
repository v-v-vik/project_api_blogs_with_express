import {Payload} from "../input-output-types/token";
import {sessionRepository} from "../repositories/guard/sessionRepository";
import {ResultModel, ResultStatus} from "../result-object/result code";


export const securityService = {
    async terminateSessionById(payload: Payload, deviceId: string): Promise<ResultModel> {
        const foundSession = await sessionRepository.findSessionById(deviceId);
        if (!foundSession) {
            return {
                status: ResultStatus.NotFound,
                data: null
            }
        }
        if (foundSession.userId !== payload.userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null
            }
        }
        const res = await sessionRepository.terminateSessionById(deviceId);
        if (!res) {
            return {
                status: ResultStatus.BadRequest,
                data: null
            }
        }
        return {
            status: ResultStatus.NoContent,
            data: null
        }

    },

    async terminateAllSessions(payload: Payload, ip: string | undefined) {
       const res: boolean = await sessionRepository.terminateAllSessions(payload, ip);
       if (!res) {
           return {
               status: ResultStatus.BadRequest,
               data: null
           }
       }
       return {
           status: ResultStatus.NoContent,
           data: null
       }
    },


}