import {SessionViewModel} from "../domain/session entity";
import {sessionQueryRepository} from "../repositories/guard/sessionQueryRepository";
import {HttpStatuses, resultCode, ResultModel, ResultStatus} from "../domain/result-object/result code";
import {Request, Response} from "express";
import {ParamType} from "../input-output-types/some";
import {sessionService} from "../application/sessionService";


class SessionController {

    async displayAll(req: Request,
                     res: Response) {

        const sessions: SessionViewModel[] = await sessionQueryRepository.showAllSessions(req.body.userId);
        if (!sessions) {
            res
                .status(HttpStatuses.BadRequest)
                .json()
            return;
        }
        res
            .status(HttpStatuses.Success)
            .json(sessions)
    }

    async deleteAll(req: Request,
                    res: Response) {

        const result = await sessionService.terminateAllSessions(req.body);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(HttpStatuses.BadRequest)
                .json()
        }
        res
            .status(HttpStatuses.NoContent)
            .json()
    }

    async deleteById(req: Request<ParamType>,
                     res: Response) {

        const result: ResultModel = await sessionService.terminateSessionById(req.body, req.params.id);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCode(result.status))
                .json();
            return;
        }
        res
            .status(HttpStatuses.NoContent)
            .json()
    }
}

export const sessionController = new SessionController()