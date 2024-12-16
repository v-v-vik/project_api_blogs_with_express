import {Request, Response} from "express";
import {sessionQueryRepository} from "../../repositories/guard/sessionQueryRepository";
import {HttpStatuses} from "../../domain/result-object/result code";
import {DeviceViewModel} from "../../input-output-types/user auth types";


export const showAllSessionsController = async (req: Request,
                                          res: Response)=> {

    const sessions: DeviceViewModel[] = await sessionQueryRepository.showAllSessions(req.body.userId);
    if (!sessions) {
        res.status(HttpStatuses.BadRequest)
        return;
        }

    res
        .status(HttpStatuses.Success)
        .send(sessions)



}