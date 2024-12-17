import {Request, Response} from 'express';
import {matchedData} from "express-validator";
import {authService} from "../../application/authService";
import {HttpStatuses, resultCode, ResultStatus} from "../../domain/result-object/result code";
import {RegistrationEmailResendingModel} from "../../domain/user entity";


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