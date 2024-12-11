
import {Request, Response} from "express";
import {ParamType} from "../../input-output-types/some";
import {securityService} from "../../domain/securityService";
import {HttpStatuses, resultCode, ResultModel, ResultStatus} from "../../result-object/result code";



export const terminateSessionByIdController = async (req: Request<ParamType>,
                                                     res: Response)=> {

    const result: ResultModel = await securityService.terminateSessionById(req.body, req.params.id);

    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCode(result.status)).send();
        return;
    }

    res
        .status(HttpStatuses.NoContent)
        .send()
}