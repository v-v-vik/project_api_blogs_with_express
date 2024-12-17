import {Request, Response} from "express";
import {NewPwRecoveryInputModel} from "../../input-output-types/auth types";
import {matchedData} from "express-validator";
import {authService} from "../../application/authService";
import {HttpStatuses, resultCode, ResultStatus} from "../../domain/result-object/result code";


export const newPasswordController = async (req: Request<any, any, NewPwRecoveryInputModel>,
                                                 res: Response) => {

    const data: NewPwRecoveryInputModel = matchedData(req);

    const result = await authService.passwordUpdate(data);
    if (result.status !== ResultStatus.NoContent) {
        res.status(resultCode(result.status)).send(result.data);
        return;
    }

    res
        .status(HttpStatuses.NoContent)
        .json();


}