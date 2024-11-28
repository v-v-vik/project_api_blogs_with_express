import {Request, Response} from 'express';
import {LoginInputModel} from "../../input-output-types/user auth types";
import {matchedData} from "express-validator";
import {authService} from "../../domain/authService";
import {HttpStatuses, ResultStatus} from "../../result-object/result code";


export const loginUserController = async (req: Request<any, any, LoginInputModel>,
                                          res: Response)=> {


    const data: LoginInputModel = matchedData(req);
    const result = await authService.loginUser(data);
    if (result === null) {
        res.status(HttpStatuses.BadRequest)
        return;
    }

    if (result.status === ResultStatus.Unauthorized) {
        res.sendStatus(HttpStatuses.Unauthorized)
        return;
    }

    if (result.data) {
         res
             .cookie("refreshToken", result.data[1], {
             httpOnly: true,
             secure: true,
             })
            .status(HttpStatuses.Success)
            .json({ accessToken: result.data[0] })


    }



}