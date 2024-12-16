import {UserInputModel} from "../../input-output-types/user auth types";
import {Request, Response} from "express";
import {matchedData} from "express-validator";
import {authService} from "../../application/authService";
import {HttpStatuses, resultCode, ResultStatus} from "../../domain/result-object/result code";


export const registrationController = async (req: Request<any, any, UserInputModel>,
                                           res: Response) => {

    const data:UserInputModel = matchedData(req);

    const result = await authService.registerUser(data);
    if (result === null) {
        res.status(HttpStatuses.BadRequest);
        return;
    }
    if (result.status !== ResultStatus.Success ) {
        res
            .status(resultCode(result.status))
            .json(result.data)
        return;
    }

    res
        .status(HttpStatuses.NoContent)
        .json();


}