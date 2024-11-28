import {Request, Response} from "express";
import {authService} from "../../domain/authService";
import {HttpStatuses, ResultStatus} from "../../result-object/result code";

export const logoutController = async (req: Request,
                                             res: Response)=> {


    const refreshToken = req.cookies.refreshToken;
    const result = await authService.logout(refreshToken, req.body);

    if (result.status !== ResultStatus.NoContent) {
        res.status(HttpStatuses.Unauthorized).send();
        return;
    }

    res
        .clearCookie("refreshToken")
        .status(HttpStatuses.NoContent)
        .json();

}