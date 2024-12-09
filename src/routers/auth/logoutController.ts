import {Request, Response} from "express";
import {HttpStatuses} from "../../result-object/result code";

export const logoutController = async (req: Request,
                                             res: Response)=> {



    res
        .clearCookie("refreshToken")
        .status(HttpStatuses.NoContent)
        .json();

}