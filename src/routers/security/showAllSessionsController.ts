import {Request, Response} from "express";
import {sessionQueryRepository} from "../../repositories/guard/sessionQueryRepository";
import {HttpStatuses} from "../../domain/result-object/result code";
import {SessionViewModel} from "../../domain/session entity";



export const showAllSessionsController = async (req: Request,
                                          res: Response)=> {

    const sessions: SessionViewModel[] = await sessionQueryRepository.showAllSessions(req.body.userId);
    if (!sessions) {
        res.status(HttpStatuses.BadRequest)
        return;
        }

    res
        .status(HttpStatuses.Success)
        .send(sessions)



}