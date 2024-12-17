import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwtService";
import {PayloadAT} from "../input-output-types/auth types";

export const accessTokenMiddleware = async (req: Request,
                                      res: Response,
                                      next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    const tokenPayload = jwtService.getUserIdByAccessToken(token) as PayloadAT;

    if (!tokenPayload) {
        res.sendStatus(401);
        return;
    }


    req.user = {id: tokenPayload.userId};
    next();
    return;
}