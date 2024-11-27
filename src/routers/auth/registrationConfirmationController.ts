import {Request, Response} from 'express';
import {matchedData} from "express-validator";
import {authService} from "../../domain/authService";
import {HttpStatuses, resultCode, ResultStatus} from "../../result-object/result code";
import {RegistrationConfirmationCodeModel} from "../../input-output-types/some";


export const registrationConfirmationController = async (req: Request<any, any, RegistrationConfirmationCodeModel>,
                                          res: Response)=> {


    const data: RegistrationConfirmationCodeModel = matchedData(req);

    console.log(data)
    const result = await authService.confirmRegistration(data.code);
    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCode(result.status)).send(result.data);
        return;
    }
    res.status(HttpStatuses.NoContent).send();





}