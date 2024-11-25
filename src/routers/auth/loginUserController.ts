import {Request, Response} from 'express';
import {LoginInputModel} from "../../input-output-types/user types";
import {matchedData} from "express-validator";
import {authService} from "../../domain/authService";


export const loginUserController = async (req: Request<any, any, LoginInputModel>,
                                          res: Response)=> {


    const data: LoginInputModel = matchedData(req);
    const accessToken = await authService.loginUser(data);

    if (!accessToken) {
        res.sendStatus(401);
        return;
    }

    res.status(200).json({accessToken});

}