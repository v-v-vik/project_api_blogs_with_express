import {Request, Response} from 'express';
import {RegistrationEmailResendingModel} from "../../input-output-types/user auth types";
import {matchedData} from "express-validator";
import {authService} from "../../domain/authService";
import {HttpStatuses, resultCode, ResultStatus} from "../../result-object/result code";


export const regEmailResendingController = async (req: Request<any, any, RegistrationEmailResendingModel>,
                                          res: Response)=> {


    const data: RegistrationEmailResendingModel = matchedData(req);
    const result = await authService.confirmationEmailResend(data.email);

    if (result === null) {
        res.status(HttpStatuses.BadRequest)
        return;
    }

    if (result.status !== ResultStatus.NoContent) {
        res
            .status(resultCode(result.status))
            .send(result.data)
        return;
    }

    res
        .status(HttpStatuses.NoContent)
        .json(result.data);

}