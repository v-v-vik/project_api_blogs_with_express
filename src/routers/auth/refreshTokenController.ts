import {Request, Response} from "express";
import {authService} from "../../application/authService";
import {HttpStatuses, ResultStatus} from "../../domain/result-object/result code";


export const refreshTokenController = async (req: Request,
                                                         res: Response)=> {



    const result = await authService.refreshToken(req.body);

    if (result.status !== ResultStatus.Success) {
        res.status(HttpStatuses.Unauthorized).send();
        return;
    }

    res
        .cookie("refreshToken", result.data[1], {
            httpOnly: true,
            secure: true
        })
        .status(HttpStatuses.Success)
        .json({ accessToken: result.data[0]});



}