import {Request, Response} from "express";
import {sessionQueryRepository} from "../../repositories/guard/sessionQueryRepository";
import {HttpStatuses} from "../../result-object/result code";


export const showAllSessionsController = async (req: Request,
                                          res: Response)=> {

    const sessions = await sessionQueryRepository.showAllSessions();
    if (!sessions) {
        res.status(HttpStatuses.BadRequest)
        return;
        }

    res
        .status(HttpStatuses.Success)
        .send(sessions)



}