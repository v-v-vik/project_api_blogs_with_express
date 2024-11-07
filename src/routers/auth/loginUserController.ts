import {Request, Response} from 'express';
import {LoginInputModel} from "../../input-output-types/user types";
import {matchedData} from "express-validator";
import {authService} from "../../domain/authService";


export const loginUserController = async (req: Request<any, any, LoginInputModel>,
                                          res: Response)=> {


    const data: LoginInputModel = matchedData(req);
    console.log("passed data:",data);
    const isLoggedIn = await authService.loginUser(data);
    console.log("is logged in:",isLoggedIn);
    if (isLoggedIn === null) {
        res.sendStatus(401)
    } else {
        res.sendStatus(204)
    }


}