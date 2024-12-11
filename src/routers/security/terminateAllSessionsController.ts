import {Request, Response} from "express";
import {HttpStatuses, ResultStatus} from "../../result-object/result code";
import {securityService} from "../../domain/securityService";


export const terminateAllSessionsController = async (req: Request,
                                                   res: Response)=> {

    const ip = req.ip;
    const result = await securityService.terminateAllSessions(req.body, ip);


    if (result.status !== ResultStatus.NoContent) {
        res.status(HttpStatuses.BadRequest).send()
    }

    res
        .status(HttpStatuses.NoContent)
        .send()



}