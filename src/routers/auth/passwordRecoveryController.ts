import {Request, Response} from "express";
import {PasswordRecoveryModel} from "../../input-output-types/user auth types";
import {matchedData} from "express-validator";
import {authService} from "../../application/authService";
import {HttpStatuses} from "../../domain/result-object/result code";


export const passwordRecoveryController = async (req: Request<any, any, PasswordRecoveryModel>,
                                            res: Response) => {

    const data: PasswordRecoveryModel = matchedData(req);

    const result = await authService.newPasswordRequest(data);
    if (!result) {
        res.status(HttpStatuses.BadRequest);
        return;
    }

    res
        .status(HttpStatuses.NoContent)
        .json();


}