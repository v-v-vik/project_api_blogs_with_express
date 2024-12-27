import {sessionRepository} from "../repositories/guard/sessionRepository";
import {ResultModel, ResultStatus} from "../domain/result-object/result code";
import {PayloadRT} from "../input-output-types/auth types";


class SessionService {
    async terminateSessionById(payload: PayloadRT, deviceId: string): Promise<ResultModel> {
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
    }

    async terminateAllSessions(payload: PayloadRT) {
       const res: boolean = await sessionRepository.terminateAllSessions(payload);
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
    }
}

export const sessionService = new SessionService();