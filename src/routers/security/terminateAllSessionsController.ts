import {Request, Response} from "express";
import {HttpStatuses, ResultStatus} from "../../domain/result-object/result code";
import {securityService} from "../../application/securityService";


export const terminateAllSessionsController = async (req: Request,
                                                   res: Response)=> {


    const result = await securityService.terminateAllSessions(req.body);


    if (result.status !== ResultStatus.NoContent) {
        res.status(HttpStatuses.BadRequest).send()
    }

    res
        .status(HttpStatuses.NoContent)
        .send()



}