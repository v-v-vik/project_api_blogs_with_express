import {Request, Response} from "express";
import {authService} from "../../domain/authService";
import {HttpStatuses, ResultStatus} from "../../result-object/result code";


export const refreshTokenController = async (req: Request,
                                                         res: Response)=> {


    console.log("payload looks like:", req.body)
    const tokenContent = req.body;
    if (req.ip && req.headers['user-agent']) {
        const result = await authService.refreshToken(tokenContent, req.ip, req.headers['user-agent']);

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

    res.status(HttpStatuses.Unauthorized).send();
    return;


}