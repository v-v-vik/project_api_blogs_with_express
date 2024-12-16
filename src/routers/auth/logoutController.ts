import {Request, Response} from "express";
import {HttpStatuses, ResultModel, ResultStatus} from "../../domain/result-object/result code";
import {authService} from "../../application/authService";

export const logoutController = async (req: Request,
                                             res: Response)=> {

    const result: ResultModel = await authService.logoutUser(req.body.deviceId);
    if (result.status === ResultStatus.BadRequest) {
        res.status(HttpStatuses.BadRequest).send({"Error": "Failed to logout"})
        return;
    }

    res
        .clearCookie("refreshToken")
        .status(HttpStatuses.NoContent)
        .json();

}